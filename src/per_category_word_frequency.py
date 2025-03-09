import json
import re
from collections import Counter

# File paths
INPUT_FILE = 'chats.json'
GLOBAL_FILE = 'global_common_words_threshold.txt'
OUTPUT_FILE = 'per_category_word_frequency_excluding_globals.txt'

# --- Step 1: Read global common words to exclude ---
global_stop_words = set()
try:
    with open(GLOBAL_FILE, 'r', encoding='utf-8') as gf:
        lines = gf.readlines()
    # Assume the first two lines are header info; process remaining lines.
    for line in lines[2:]:
        line = line.strip()
        if not line:
            continue
        # Each line is expected to start with the word followed by a colon.
        word = line.split(":", 1)[0].strip()
        if word:
            global_stop_words.add(word)
except FileNotFoundError:
    print(f"Global file {GLOBAL_FILE} not found. Proceeding without global exclusion.")
    global_stop_words = set()

# --- Step 2: Load chats.json ---
with open(INPUT_FILE, 'r', encoding='utf-8') as f:
    data = json.load(f)

chats = data.get('chats', [])
categories_dict = data.get('categories', {})
all_categories = list(categories_dict.keys())

# Regex pattern to capture words (alphanumeric tokens)
word_pattern = re.compile(r'\b\w+\b')

# Dictionary to store word frequency Counter for each category.
category_word_freq = {}

for cat in all_categories:
    # Filter chats that are assigned this category.
    cat_chats = [chat for chat in chats if chat.get('categories') and cat in chat.get('categories')]
    counter = Counter()
    for chat in cat_chats:
        # Combine title and messages, then normalize to lowercase.
        full_text = (chat.get('title', '') + ' ' + ' '.join(chat.get('chats', []))).lower()
        # Extract words, filtering out tokens that are entirely numeric.
        words = [word for word in word_pattern.findall(full_text) if not word.isdigit()]
        # Update the counter.
        counter.update(words)
    # Exclude words that appear in the global stop list.
    filtered_counter = Counter({word: cnt for word, cnt in counter.items() if word not in global_stop_words})
    category_word_freq[cat] = filtered_counter

# --- Step 3: Write the results to the output file ---
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    for cat, counter in category_word_freq.items():
        f.write(f"Category: {cat}\n")
        f.write("-" * (10 + len(cat)) + "\n")
        # Write the top 50 words (after excluding global common words)
        for word, count in counter.most_common(50):
            f.write(f"{word}: {count}\n")
        f.write("\n\n")

print(f"Per-category word frequency analysis (excluding global common words) complete. Results written to {OUTPUT_FILE}")
