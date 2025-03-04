import React, { useState, useEffect } from 'react';

function Message({ id, text, isUser, searchTerm, forceMaximize }) {
  const [expanded, setExpanded] = useState(forceMaximize || false);

  // When forceMaximize changes, update the expanded state
  useEffect(() => {
    setExpanded(forceMaximize);
  }, [forceMaximize]);

  const getHighlightedText = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === highlight.toLowerCase() ? <mark key={i}>{part}</mark> : part
    );
  };

  const containerStyle = {
    margin: '10px 0',
    textAlign: isUser ? 'right' : 'left',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    width: isUser ? '60%' : '100%',
    marginLeft: isUser ? 'auto' : '0'
  };

  const contentStyle = {
    overflow: 'hidden',
    maxHeight: expanded ? 'none' : '3em',
    whiteSpace: 'pre-wrap'
  };

  const toggleButtonStyle = {
    marginBottom: '5px',
    float: isUser ? 'right' : 'left'
  };

  return (
    <div id={id} style={containerStyle}>
      <button onClick={() => setExpanded(!expanded)} style={toggleButtonStyle}>
        {expanded ? 'Minimize' : 'Maximize'}
      </button>
      <div style={{ clear: 'both' }}></div>
      <div style={contentStyle}>
        {searchTerm ? getHighlightedText(text, searchTerm) : text}
      </div>
    </div>
  );
}

export default Message;
