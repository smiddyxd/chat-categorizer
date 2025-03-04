const fs = require('fs');

// 1. Read the existing chats.json file (which is currently just an array of chat objects)
const oldFileName = 'chats.json';
const newFileName = 'chats.json';
const backupFileName = 'chats_old.json';

try {
  // Read the old file
  const oldData = fs.readFileSync(oldFileName, 'utf8');
  // Parse the old JSON (should be an array of chats)
  const chatsArray = JSON.parse(oldData);

  // 2. Rename the old file to chats_old.json (for backup)
  fs.renameSync(oldFileName, backupFileName);

  // 3. Build the new structure
  //    Start with an empty categories object or populate it if you have initial data.
  const newStructure = {
    categories: {
      "Personal Life / Past": ["louisa", "tristan", "niklas", "philipp", "avoidant"],
      "Coding": ["bash", "python", "javascript", "ahk", "chrome extension", "popup.html", "ffmpeg"],
      "Digital Media": ["mp3", "wav", "flac", "obs"],
      "MBTI": [
        "ti", "introverted thinking", 
        "te", "extraverted thinking", "te", "extroverted thinking", 
        "ni", "introverted intuition", 
        "ne", "extraverted intuition", "ne", "extroverted intuition", 
        "fi", "introverted feeling", 
        "fe", "extraverted feeling", "fe", "extroverted feeling", 
        "si", "introverted sensing", 
        "se", "extraverted sensing", "se", "extroverted sensing",
        "cognitive function"
      ],
      "psychology": ["neuro"],
      "translate": ["translate", "semantically"],
      "Transcripts": []
    },
    chats: []
  };
  

  // 4. Add a "cache" array to each chat and place it under "chats" in the new structure
  const updatedChats = chatsArray.map(chat => {
    // If a chat already has a categories array or other fields, preserve them
    return {
      ...chat,
      cache: [] // add a new empty cache array
    };
  });

  newStructure.chats = updatedChats;

  // 5. Write the new structure to chats.json
  fs.writeFileSync(
    newFileName,
    JSON.stringify(newStructure, null, 2),
    'utf8'
  );

  console.log('Transformation complete.');
  console.log(`Old file renamed to "${backupFileName}"`);
  console.log(`New file created as "${newFileName}"`);
} catch (err) {
  console.error('Error transforming chats:', err);
}
