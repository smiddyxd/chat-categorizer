import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import CategoryFilter from './CategoryFilter';
import CategoryCheckboxes from './CategoryCheckboxes';
import ChatDisplay from './ChatDisplay';
import chatsData from './chats.json'; // New structure: { categories: { ... }, chats: [...] }

/* global chrome */
function App() {
  const [chats, setChats] = useState([]);
  const [categories, setCategories] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);

  // Helper to persist both chats and categories to chrome.storage.local
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
    chrome.storage.local.get(["chats", "categories"], (result) => {
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
      // Save fallback data if nothing is in storage
      if (!result.chats || result.chats.length === 0 || !result.categories) {
        chrome.storage.local.set({ chats: chatsData.chats, categories: chatsData.categories });
      }
    });
  }, []);

  // Filter logic: only show chats that have all activeFilters in their categories
  const filteredChats = chats.filter(chat => {
    if (activeFilters.length === 0) return true;
    return activeFilters.every(cat => chat.categories && chat.categories.includes(cat));
  });

  // Handler to update the categories array of a chat
  const updateChatCategories = (chatToUpdate, newCategories) => {
    const updatedChats = chats.map(c => {
      if (c.title === chatToUpdate.title) {
        return { ...c, categories: newCategories };
      }
      return c;
    });
    setChats(updatedChats);
    if (selectedChat && selectedChat.url === chatToUpdate.url) {
      setSelectedChat({ ...selectedChat, categories: newCategories });
    }
    saveDataToStorage(updatedChats, categories);
  };

  // Handler to update the global categories (for example, when adding, editing, or deleting keywords)
  const updateGlobalCategories = (newCategories) => {
    setCategories(newCategories);
    saveDataToStorage(chats, newCategories);
  };

  // Download current data (chats and categories) as a JSON file
  const handleDownload = () => {
    const data = JSON.stringify({ categories, chats,  }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger download
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
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          categoriesData={categories}
        />
        <Sidebar
          chats={filteredChats}
          selectedChat={selectedChat}
          onSelectChat={setSelectedChat}
        />
      </div>

      {/* Main area: selected chat details */}
      <div style={{ flex: 1, padding: '10px', overflowY: 'auto', marginTop: '40px' }}>
        {selectedChat ? (
          <>
            <CategoryCheckboxes
              chat={selectedChat}
              onUpdate={updateChatCategories}
            />
            <ChatDisplay chat={selectedChat} />
          </>
        ) : (
          <div>Select a chat from the sidebar.</div>
        )}
      </div>
    </div>
  );
}

export default App;
