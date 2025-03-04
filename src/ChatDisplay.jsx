import React from 'react';
import Message from './Message';

function ChatDisplay({ chat }) {
  // chat.chats is an array of message strings
  return (
    <div>
      <h2>{chat.title}</h2>
      {chat.chats.map((msg, index) => {
        // We'll treat even indices as user messages, odd as ChatGPT
        const isUser = index % 2 === 0;
        return (
          <Message
            key={index}
            text={msg}
            isUser={isUser}
          />
        );
      })}
    </div>
  );
}

export default ChatDisplay;
