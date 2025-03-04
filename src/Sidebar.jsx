import React, { useState } from 'react';

function Sidebar({ chats, onSelectChat, selectedChat }) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter chats based on search term
  const filteredChats = chats.filter(chat => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true; // if no search term, include all chats

    // Check if any cached keyword exactly matches the search term (ignoring case)
    if (chat.cache && chat.cache.some(keyword => keyword.toLowerCase() === term)) {
      return true;
    }

    // Otherwise, search in the chat title and messages text
    const combinedText = (
      (chat.title || "") + " " + (chat.chats ? chat.chats.join(" ") : "")
    ).toLowerCase();

    return combinedText.includes(term);
  });

  return (
    <div>
      <input
        type="text"
        placeholder="Search chats..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />
      {filteredChats.map(chat => (
        <div
          key={chat.url}
          onClick={() => onSelectChat(chat)}
          style={{
            padding: "5px",
            cursor: "pointer",
            backgroundColor: selectedChat && selectedChat.url === chat.url ? "#ddd" : "transparent"
          }}
        >
          {chat.title}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
