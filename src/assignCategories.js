#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Path to your chats.json
const INPUT_FILE = path.join(__dirname, 'chats.json');
// Output file for the updated JSON
const OUTPUT_FILE = path.join(__dirname, 'chats_updated.json');

// Read the JSON data
const data = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8'));
const { categories, chats } = data;

/**
 * For a given keyword, if it is in regex format (i.e. starts and ends with /),
 * return a RegExp object (with the "i" flag). Otherwise, return a lowercased string.
 */
function parseKeyword(keyword) {
  const trimmed = keyword.trim();
  if (trimmed.startsWith('/') && trimmed.endsWith('/') && trimmed.length > 2) {
    const pattern = trimmed.slice(1, -1); // Remove leading and trailing slashes
    try {
      return new RegExp(pattern, 'i'); // case-insensitive regex
    } catch (err) {
      console.warn(`Invalid regex keyword: ${keyword}. Using plain string instead.`);
      return keyword.toLowerCase();
    }
  }
  return keyword.toLowerCase();
}

/**
 * Check whether the given text matches the keyword.
 * If the keyword is a RegExp, use test(), else use substring search.
 */
function matchesKeyword(text, kw) {
  if (kw instanceof RegExp) {
    return kw.test(text);
  }
  return text.includes(kw);
}

// Pre-parse all keywords for each category.
const categoryKeywordMap = {};
for (const catName in categories) {
  categoryKeywordMap[catName] = categories[catName].map(parseKeyword);
}

// First, clear existing category assignments on every chat.
chats.forEach(chat => {
  chat.categories = [];
});

// For each chat, combine title and messages into a single lowercase string.
chats.forEach(chat => {
  const fullText = (chat.title + ' ' + chat.chats.join(' ')).toLowerCase();

  // For each category, check if any keyword is present.
  for (const catName in categoryKeywordMap) {
    const keywords = categoryKeywordMap[catName];
    // If any keyword matches, assign the category.
    for (const kw of keywords) {
      if (matchesKeyword(fullText, kw)) {
        chat.categories.push(catName);
        break; // Stop checking further keywords for this category.
      }
    }
  }
});

// Write the updated data to the output file.
const updatedData = JSON.stringify({ categories, chats }, null, 2);
fs.writeFileSync(OUTPUT_FILE, updatedData, 'utf8');

console.log(`Categories have been reassigned. Updated file written to: ${OUTPUT_FILE}`);
