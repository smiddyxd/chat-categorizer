import json
import re
from collections import Counter

# File paths
INPUT_FILE = 'chats.json'
OUTPUT_FILE = 'global_common_words_threshold.txt'

# Load chats.json
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

chats = data.get('chats', [])
# Get category names from the categories object
all_categories = list(data.get('categories', {}).keys())

# We'll compute a frequency Counter for each category,
# using only chats that have that category assigned.
category_word_freq = {}
# Regex pattern to capture words (alphanumeric strings)
word_pattern = re.compile(r'\b\w+\b')

for cat in all_categories:
    # Filter: only include chats that have at least one category AND include this category
    cat_chats = [chat for chat in chats if chat.get('categories') and cat in chat.get('categories')]
    if not cat_chats:
        continue  # Skip if no chats for this category
    counter = Counter()
    for chat in cat_chats:
        # Combine title and messages, normalize to lowercase.
        full_text = (chat.get('title', '') + ' ' + ' '.join(chat.get('chats', []))).lower()
        # Extract words and filter out tokens that are entirely numeric.
        words = [word for word in word_pattern.findall(full_text) if not word.isdigit()]
        counter.update(words)
    category_word_freq[cat] = counter

if not category_word_freq:
    print("No categories with assigned chats found. Exiting.")
    exit(1)

# Build a global dictionary mapping each word to a dict of category frequencies
global_word_data = {}
for cat, counter in category_word_freq.items():
    for word, freq in counter.items():
        if word not in global_word_data:
            global_word_data[word] = {}
        global_word_data[word][cat] = freq

# Set the threshold: words must appear in at least THRESHOLD categories.
THRESHOLD = 6  # "more than 4" means at least 5 categories

# Filter global_word_data to include only words that appear in at least THRESHOLD categories.
filtered_words = {word: freq_data for word, freq_data in global_word_data.items() if len(freq_data) >= THRESHOLD}

# Optionally, sort filtered words by total frequency (across all categories), descending.
sorted_words = sorted(filtered_words.items(),
                      key=lambda item: sum(item[1].values()),
                      reverse=True)

# Write the results to OUTPUT_FILE.
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write(f"Words shared by at least {THRESHOLD} categories (frequency per category):\n")
    f.write("---------------------------------------------------------------\n")
    for word, freq_data in sorted_words:
        freq_str = ", ".join([f"{cat}: {freq}" for cat, freq in freq_data.items()])
        f.write(f"{word}: {freq_str}\n")

print(f"Common words analysis complete. Results written to {OUTPUT_FILE}")
