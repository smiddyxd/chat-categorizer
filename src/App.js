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
  const [displayedChat, setDisplayedChat] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);
  const [activeKeywords, setActiveKeywords] = useState([]);
  const [bulkSelectedChats, setBulkSelectedChats] = useState([]);

  // Persist changes to storage
  const saveDataToStorage = (updatedChats, updatedCategories) => {
    chrome.storage.local.set({ chats: updatedChats, categories: updatedCategories }, () => {
      console.log('Data saved to storage.');
    });
  };

  // On mount, load from storage or fallback to chatsData
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
      if (!result.chats || result.chats.length === 0 || !result.categories) {
        chrome.storage.local.set({ chats: chatsData.chats, categories: chatsData.categories });
      }
    });
  }, []);

  // Filtering logic
  const filteredChats = chats.filter(chat => {
    // 1) Must have all activeFilters in chat.categories
    const hasAllCategories = activeFilters.every(cat =>
      chat.categories && chat.categories.includes(cat)
    );
    if (!hasAllCategories) return false;

    // 2) If no activeKeywords, no constraint
    if (activeKeywords.length === 0) return true;

    // 3) Must match at least one active keyword by substring
    const combinedText = ((chat.title || "") + " " + (chat.chats || []).join(" ")).toLowerCase();
    return activeKeywords.some(kw => combinedText.includes(kw));
  });

  // Handler to update categories in a single chat
  const updateChatCategories = (chatToUpdate, newCategories) => {
    const updatedChats = chats.map(c =>
      c.url === chatToUpdate.url ? { ...c, categories: newCategories } : c
    );
    setChats(updatedChats);
    if (displayedChat && displayedChat.url === chatToUpdate.url) {
      setDisplayedChat({ ...displayedChat, categories: newCategories });
    }
    saveDataToStorage(updatedChats, categories);
  };

  // Bulk category updates for selected chats
  const handleBulkCategoryUpdate = (category, shouldAdd) => {
    const updatedChats = chats.map(chat => {
      if (bulkSelectedChats.includes(chat.url)) {
        const catArr = chat.categories || [];
        if (shouldAdd && !catArr.includes(category)) {
          return { ...chat, categories: [...catArr, category] };
        } else if (!shouldAdd && catArr.includes(category)) {
          return { ...chat, categories: catArr.filter(c => c !== category) };
        }
      }
      return chat;
    });
    setChats(updatedChats);
    saveDataToStorage(updatedChats, categories);
  };

  // Manage selection for bulk updates
  const handleToggleChatSelection = (url) => {
    setBulkSelectedChats(prev =>
      prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]
    );
  };

  const handleSelectAll = (shouldSelect) => {
    if (shouldSelect) {
      const allVisible = filteredChats.map(chat => chat.url);
      setBulkSelectedChats(allVisible);
    } else {
      setBulkSelectedChats([]);
    }
  };

  // *** KEY PART: Handling add/edit/remove category or keyword
  const handleEditCategories = (action) => {
    // action: { type: string, category?: string, newCategory?: string, keyword?: string, newKeyword?: string, ... }
    const newCats = { ...categories };
    switch (action.type) {
      case 'ADD_CATEGORY': {
        if (!action.category || newCats[action.category]) break;
        newCats[action.category] = []; // create empty keyword list
        break;
      }
      case 'EDIT_CATEGORY': {
        // rename a category
        const { category, newCategory } = action;
        if (!newCats[category] || newCats[newCategory]) break;
        newCats[newCategory] = newCats[category];
        delete newCats[category];
        // If we had category in activeFilters, rename that too
        if (activeFilters.includes(category)) {
          setActiveFilters(prev => prev.map(c => (c === category ? newCategory : c)));
        }
        break;
      }
      case 'REMOVE_CATEGORY': {
        if (!action.category || !newCats[action.category]) break;
        delete newCats[action.category];
        // Also remove from activeFilters if present
        if (activeFilters.includes(action.category)) {
          setActiveFilters(prev => prev.filter(c => c !== action.category));
        }
        break;
      }
      case 'ADD_KEYWORD': {
        const { category, keyword } = action;
        if (!newCats[category]) break;
        if (!newCats[category].includes(keyword)) {
          newCats[category] = [...newCats[category], keyword];
        }
        break;
      }
      case 'EDIT_KEYWORD': {
        const { category, keyword, newKeyword } = action;
        if (!newCats[category]) break;
        const idx = newCats[category].indexOf(keyword);
        if (idx !== -1 && !newCats[category].includes(newKeyword)) {
          // rename
          newCats[category] = newCats[category].map(kw => (kw === keyword ? newKeyword : kw));
        }
        break;
      }
      case 'REMOVE_KEYWORD': {
        const { category, keyword } = action;
        if (!newCats[category]) break;
        newCats[category] = newCats[category].filter(k => k !== keyword);
        break;
      }
      default:
        break;
    }
    setCategories(newCats);
    saveDataToStorage(chats, newCats);
  };

  // Derive array of actual selected chat objects
  const multiSelectedChats = chats.filter(c => bulkSelectedChats.includes(c.url));

  // Download current data
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
    <div style={{ display: 'flex', height: '100vh', width: '100vw', position: 'relative' }}>
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

      {/* Left side: category filter + sidebar */}
      <div style={{ width: '350px', borderRight: '1px solid #ccc', overflowY: 'auto', marginTop: '40px', padding: '10px' }}>
        <CategoryFilter
          categoriesData={categories}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          activeKeywords={activeKeywords}
          setActiveKeywords={setActiveKeywords}
          onEditCategories={handleEditCategories} // new callback
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

      {/* Right side: main area */}
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto', marginTop: '40px' }}>
        {bulkSelectedChats.length > 0 ? (
          <CategoryCheckboxes
            selectedChats={chats.filter(c => bulkSelectedChats.includes(c.url))}
            onBulkCategoryUpdate={handleBulkCategoryUpdate}
          />
        ) : displayedChat ? (
          <>
            <CategoryCheckboxes
              chat={displayedChat}
              onUpdate={updateChatCategories}
              categoriesData={categories}
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
