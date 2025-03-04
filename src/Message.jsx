import React, { useState } from 'react';

function Message({ text, isUser }) {
  const [expanded, setExpanded] = useState(false);

  // Show only ~3 lines if collapsed
  const containerStyle = {
    margin: '10px 0',
    textAlign: isUser ? 'right' : 'left',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    width: isUser ? '60%' : '100%',
    marginLeft: isUser ? 'auto' : '0'
  };

  const previewStyle = {
    overflow: 'hidden',
    maxHeight: expanded ? 'none' : '3em',
    whiteSpace: 'pre-wrap'
  };

  // The toggle button sits at the top for demonstration;
  // you could also place another at the bottom if you like
  const toggleButtonStyle = {
    display: 'block',
    marginBottom: '5px',
    float: isUser ? 'right' : 'left'
  };

  return (
    <div style={containerStyle}>
      <button style={toggleButtonStyle} onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Minimize' : 'Maximize'}
      </button>
      <div style={{ clear: 'both' }}></div>
      <div style={previewStyle}>
        {text}
      </div>
      {expanded && (
        <button
          style={{ float: isUser ? 'right' : 'left', marginTop: '5px' }}
          onClick={() => setExpanded(false)}
        >
          Minimize
        </button>
      )}
      <div style={{ clear: 'both' }}></div>
    </div>
  );
}

export default Message;
