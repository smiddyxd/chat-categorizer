const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'chats.json');
const backupPath = path.join(__dirname, 'chats_backup.json');

try {
  // Read the existing chats.json file
  const dataRaw = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(dataRaw);

  // Create a backup of the original file
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Backup created at ${backupPath}`);

  // Remove the "cache" property from each chat item
  if (Array.isArray(data.chats)) {
    data.chats.forEach(chat => {
      if (chat.hasOwnProperty('cache')) {
        delete chat.cache;
      }
    });
  } else {
    console.error("The 'chats' property is not an array.");
    process.exit(1);
  }

  // Write the updated data back to chats.json
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Cache arrays removed from each chat in ${filePath}`);
} catch (err) {
  console.error("Error processing file:", err);
}
