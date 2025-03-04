import React, { useState, useEffect } from 'react';
import Message from './Message';

function ChatDisplay({ chat }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [lockedSearchTerm, setLockedSearchTerm] = useState("");
  const [matchIndices, setMatchIndices] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(0);

  // When lockedSearchTerm changes, recalculate match indices based on that term.
  useEffect(() => {
    if (!lockedSearchTerm.trim()) {
      setMatchIndices([]);
      setCurrentMatch(0);
    } else {
      const lowerSearch = lockedSearchTerm.toLowerCase();
      const indices = chat.chats.reduce((acc, msg, idx) => {
        if (msg.toLowerCase().includes(lowerSearch)) {
          acc.push(idx);
        }
        return acc;
      }, []);
      setMatchIndices(indices);
      setCurrentMatch(0);
    }
  }, [lockedSearchTerm, chat.chats]);

  // On Enter, either lock the search term or, if already locked, jump to the next match.
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (lockedSearchTerm !== searchTerm) {
        setLockedSearchTerm(searchTerm);
      } else if (matchIndices.length > 0) {
        const nextMatch = (currentMatch + 1) % matchIndices.length;
        setCurrentMatch(nextMatch);
        const msgElement = document.getElementById(`message-${matchIndices[nextMatch]}`);
        if (msgElement) {
          msgElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  return (
    <div>
      <h2>
        <a href={chat.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
          {chat.title}
        </a>
      </h2>
      <input
        type="text"
        placeholder="Search within chat..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
      />
      {chat.chats.map((msg, index) => {
        const lowerMsg = msg.toLowerCase();
        const lowerLocked = lockedSearchTerm.toLowerCase();
        // Determine if this message matches the locked search term.
        const hasMatch = lockedSearchTerm.trim() !== "" && lowerMsg.includes(lowerLocked);
        return (
          <Message
            key={index}
            id={`message-${index}`}
            text={msg}
            isUser={index % 2 === 0}
            // Pass the locked search term for highlighting if this message matches
            searchTerm={hasMatch ? lockedSearchTerm : null}
            // Force maximize messages that match; non-matching messages remain collapsed
            forceMaximize={hasMatch}
          />
        );
      })}
    </div>
  );
}

export default ChatDisplay;
