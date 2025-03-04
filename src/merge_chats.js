const fs = require('fs');
const path = require('path');

// File paths
const mainFile = path.join(__dirname, 'chats.json');
const newChatsFile = path.join(__dirname, 'new_chats.json');
const backupFile = path.join(__dirname, 'chats_backup.json');

// Load main chats data
let mainData;
try {
  const mainRaw = fs.readFileSync(mainFile, 'utf8');
  mainData = JSON.parse(mainRaw);
} catch (err) {
  console.error("Error reading main chats file:", err);
  process.exit(1);
}

// Load new chats data
let newData;
try {
  const newRaw = fs.readFileSync(newChatsFile, 'utf8');
  newData = JSON.parse(newRaw);
} catch (err) {
  console.error("Error reading new chats file:", err);
  process.exit(1);
}

// Ensure both have a "chats" array and preserve categories from main (or merge if needed)
if (!Array.isArray(mainData.chats)) {
  console.error("Main chats file does not contain a valid 'chats' array.");
  process.exit(1);
}
if (!Array.isArray(newData.chats)) {
  console.error("New chats file does not contain a valid 'chats' array.");
  process.exit(1);
}

// Create a backup of the main file
try {
  fs.writeFileSync(backupFile, JSON.stringify(mainData, null, 2), 'utf8');
  console.log("Backup saved to", backupFile);
} catch (err) {
  console.error("Error creating backup file:", err);
}

// Create a lookup table for main chats using URL as key
const mainChatsByUrl = {};
mainData.chats.forEach(chat => {
  if (chat.url) {
    mainChatsByUrl[chat.url] = chat;
  }
});

// Process new chats
newData.chats.forEach(newChat => {
  if (!newChat.url) {
    // Skip if no URL present
    return;
  }
  const existingChat = mainChatsByUrl[newChat.url];
  if (existingChat) {
    // If chat already exists, check if newChat has more messages than existingChat.
    // Assuming that messages are appended in order.
    if (Array.isArray(newChat.chats) && newChat.chats.length > (existingChat.chats?.length || 0)) {
      console.log(`Updating chat at URL ${newChat.url} with additional messages.`);
      // Here, we simply replace the messages array.
      // Alternatively, you could merge intelligently if needed.
      existingChat.chats = newChat.chats;
    }
  } else {
    // Chat does not exist in mainData, so add it.
    console.log(`Adding new chat at URL ${newChat.url}.`);
    mainData.chats.push(newChat);
    mainChatsByUrl[newChat.url] = newChat;
  }
});

// Write merged data back to the main file
try {
  fs.writeFileSync(mainFile, JSON.stringify(mainData, null, 2), 'utf8');
  console.log("Merged data saved to", mainFile);
} catch (err) {
  console.error("Error writing merged data:", err);
  process.exit(1);
}
