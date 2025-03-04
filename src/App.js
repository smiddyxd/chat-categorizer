import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import CategoryFilter from './CategoryFilter';
import CategoryCheckboxes from './CategoryCheckboxes';
import ChatDisplay from './ChatDisplay';
import chatsData from './chats.json'; // { categories: { ... }, chats: [...] }

/* global chrome */
function App() {
  const [chats, setChats] = useState([]);
  const [categories, setCategories] = useState({});
  const [displayedChat, setDisplayedChat] = useState(null); // single chat for display
  const [activeFilters, setActiveFilters] = useState([]);
  const [activeKeywords, setActiveKeywords] = useState([]);
  const [bulkSelectedChats, setBulkSelectedChats] = useState([]); // array of chat URLs for bulk updates

  // Persist both chats and categories to chrome.storage
  const saveDataToStorage = (updatedChats, updatedCategories) => {
    chrome.storage.local.set(
      { chats: updatedChats, categories: updatedCategories },
      () => {
        console.log('Data saved to storage.');
      }
    );
  };

  // On mount, load chats and categories from chrome.storage
  useEffect(() => {
    chrome.storage.local.get(['chats', 'categories'], (result) => {
      if (result.chats && result.chats.length > 0) {
        setChats(result.chats);
      } else {
        setChats(chatsData.chats);
      }
      if (result.categories && Object.keys(result.categories).length > 0) {
        setCategories(result.categories);
      } else {
        setCategories(chatsData.categories);
      }
      // Save fallback if none in storage
      if (!result.chats || result.chats.length === 0 || !result.categories) {
        chrome.storage.local.set({ chats: chatsData.chats, categories: chatsData.categories });
      }
    });
  }, []);

  // Filter logic: only show chats that have all activeFilters in their categories
  const filteredChats = chats.filter(chat => {
    // 1) Category filter: must have all activeFilters
    const hasAllCategories = activeFilters.every(cat =>
      chat.categories && chat.categories.includes(cat)
    );
    if (!hasAllCategories) return false;
  
    // 2) Keyword filter: if activeKeywords is empty, no constraint
    if (activeKeywords.length === 0) return true;
  
    // If we have active keywords, chat must match at least one.
    // We'll do a case-insensitive substring check over the chat’s text.
    const combinedText = ((chat.title || "") + " " + (chat.chats || []).join(" ")).toLowerCase();
    // Check if combinedText includes at least one of the activeKeywords
    return activeKeywords.some(kw => combinedText.includes(kw));
  });

  // Single‐chat update handler
  const updateChatCategories = (chatToUpdate, newCategories) => {
    const updatedChats = chats.map((c) =>
      c.url === chatToUpdate.url ? { ...c, categories: newCategories } : c
    );
    setChats(updatedChats);

    if (displayedChat && displayedChat.url === chatToUpdate.url) {
      setDisplayedChat({ ...displayedChat, categories: newCategories });
    }
    saveDataToStorage(updatedChats, categories);
  };

  // Bulk update: add or remove a category from all selected chats
  const handleBulkCategoryUpdate = (category, shouldAdd) => {
    const updatedChats = chats.map((chat) => {
      if (bulkSelectedChats.includes(chat.url)) {
        const catArr = chat.categories || [];
        if (shouldAdd) {
          // add if not present
          if (!catArr.includes(category)) {
            return { ...chat, categories: [...catArr, category] };
          }
        } else {
          // remove if present
          if (catArr.includes(category)) {
            return { ...chat, categories: catArr.filter((c) => c !== category) };
          }
        }
      }
      return chat;
    });
    setChats(updatedChats);
    saveDataToStorage(updatedChats, categories);
  };

  // Toggle selection for bulk updates
  const handleToggleChatSelection = (url) => {
    setBulkSelectedChats((prev) =>
      prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
    );
  };

  // Select / deselect all visible chats
  const handleSelectAll = (shouldSelect) => {
    if (shouldSelect) {
      const allVisible = filteredChats.map((chat) => chat.url);
      setBulkSelectedChats(allVisible);
    } else {
      setBulkSelectedChats([]);
    }
  };

  // Derive an array of the actual selected chat objects
  const multiSelectedChats = chats.filter((c) => bulkSelectedChats.includes(c.url));

  // Download button
  const handleDownload = () => {
    const data = JSON.stringify({ categories, chats }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chats.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: 'flex', height: '600px', width: '900px', position: 'relative' }}>
      {/* Download button at top left */}
      <button
        onClick={handleDownload}
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000,
          padding: '5px 10px'
        }}
      >
        Download
      </button>

      {/* Left side: filters + sidebar */}
      <div style={{ width: '250px', borderRight: '1px solid #ccc', overflowY: 'auto', marginTop: '40px' }}>
        <CategoryFilter
          categoriesData={categories}   // pass your categories object from JSON
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          activeKeywords={activeKeywords}
          setActiveKeywords={setActiveKeywords}
        />
        <Sidebar
          chats={filteredChats}
          displayedChat={displayedChat}
          onSelectChat={setDisplayedChat}
          bulkSelectedChats={bulkSelectedChats}
          onToggleChatSelection={handleToggleChatSelection}
          onSelectAll={handleSelectAll}
        />
      </div>

      {/* Main area: displayed chat details */}
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto', marginTop: '40px' }}>
        {/* If multiple chats are selected, show bulk assignment. Otherwise show single chat assignment. */}
        {multiSelectedChats.length > 0 ? (
          // Bulk mode: reflect shared categories and allow toggling them
          <CategoryCheckboxes
            selectedChats={multiSelectedChats}
            onBulkCategoryUpdate={handleBulkCategoryUpdate}
          />
        ) : displayedChat ? (
          // Single-chat mode
          <>
            <CategoryCheckboxes
              chat={displayedChat}
              onUpdate={updateChatCategories}
            />
            <ChatDisplay chat={displayedChat} />
          </>
        ) : (
          <div>Select a chat from the sidebar.</div>
        )}
      </div>
    </div>
  );
}

export default App;
