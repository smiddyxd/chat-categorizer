const fs = require('fs');
const path = require('path');

const file1 = fs.readFileSync(path.join(__dirname, 'chats.json'), 'utf8');
const file2 = fs.readFileSync(path.join(__dirname, 'updated_chats.json'), 'utf8');

if (file1 === file2) {
  console.log('Files are identical.');
} else {
  console.log('Files are different.');
}
