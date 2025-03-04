import React, { useState } from 'react';

function Sidebar({ chats, displayedChat, onSelectChat, bulkSelectedChats, onToggleChatSelection, onSelectAll }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    const combinedText = (
      (chat.title || "") + " " + (chat.chats ? chat.chats.join(" ") : "")
    ).toLowerCase();
    return combinedText.includes(term);
  });

  // Determine if all visible chats are selected for bulk update
  const allSelected = filteredChats.length > 0 && filteredChats.every(chat => bulkSelectedChats.includes(chat.url));

  const handleSelectAllChange = (e) => {
    onSelectAll(e.target.checked);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search chats..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      {/* Select All / Deselect All Checkbox */}
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={handleSelectAllChange}
            style={{ marginRight: '5px' }}
          />
          Select All
        </label>
      </div>
      {filteredChats.map(chat => {
        const isBulkSelected = bulkSelectedChats.includes(chat.url);
        return (
          <div
            key={chat.url}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: "5px",
              cursor: "pointer",
              backgroundColor: (displayedChat && displayedChat.url === chat.url) ? "#ddd" : "transparent"
            }}
          >
            <input
              type="checkbox"
              checked={isBulkSelected}
              onChange={() => onToggleChatSelection(chat.url)}
              style={{ marginRight: "5px" }}
            />
            <span onClick={() => onSelectChat(chat)}>{chat.title}</span>
          </div>
        );
      })}
    </div>
  );
}

export default Sidebar;
