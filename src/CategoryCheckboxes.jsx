import React, { useState } from 'react';

const ALL_CATEGORIES = [
  "Personal Life / Past",
  "Coding",
  "Digital Media",
  "MBTI",
  "psychology",
  "translate",
  "Transcripts"
];

function CategoryCheckboxes(props) {
  // If selectedChats prop exists, we're in bulk mode.
  if (props.selectedChats && props.selectedChats.length > 0) {
    // BULK MODE
    const sharedCategories = props.selectedChats.reduce((acc, c, index) => {
      const cats = c.categories || [];
      if (index === 0) {
        return new Set(cats);
      } else {
        const newAcc = new Set();
        for (const cat of acc) {
          if (cats.includes(cat)) {
            newAcc.add(cat);
          }
        }
        return newAcc;
      }
    }, new Set());
    
    const handleToggleCategory = (category) => {
      const isShared = sharedCategories.has(category);
      if (props.onBulkCategoryUpdate) {
        // Toggle: if shared, remove; if not, add
        props.onBulkCategoryUpdate(category, !isShared);
      }
    };

    return (
      <div style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h3>Assign Categories (Bulk)</h3>
        {ALL_CATEGORIES.map(cat => {
          const isShared = sharedCategories.has(cat);
          return (
            <label key={cat} style={{ display: 'block', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isShared}
                onChange={() => handleToggleCategory(cat)}
              />
              {cat}
            </label>
          );
        })}
      </div>
    );
  } else if (props.chat) {
    // SINGLE-CHAT MODE
    const { chat, onUpdate, categoriesData } = props;
    const chatCategories = chat.categories || [];
    // Combine the chat title and messages for keyword matching
    const combinedText = ((chat.title || "") + " " + (chat.chats || []).join(" ")).toLowerCase();

    const handleToggle = (cat) => {
      let updatedCategories;
      if (chatCategories.includes(cat)) {
        updatedCategories = chatCategories.filter(c => c !== cat);
      } else {
        updatedCategories = [...chatCategories, cat];
      }
      if (onUpdate) {
        onUpdate(chat, updatedCategories);
      }
    };

    return (
      <div style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h3>Assign Categories (Single Chat)</h3>
        {ALL_CATEGORIES.map(cat => (
          <div key={cat}>
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={chatCategories.includes(cat)}
                onChange={() => handleToggle(cat)}
              />
              {cat}
            </label>
            {/* Dropdown for keywords in this category */}
            {categoriesData && categoriesData[cat] && (
              <details style={{ marginLeft: '20px', marginTop: '5px' }}>
                <summary style={{ cursor: 'pointer' }}>Keywords</summary>
                {categoriesData[cat].length === 0 ? (
                  <div style={{ fontStyle: 'italic', color: '#999', marginLeft: '10px' }}>No keywords</div>
                ) : (
                  categoriesData[cat].map(keyword => {
                    const kwLower = keyword.toLowerCase();
                    const isPresent = combinedText.includes(kwLower);
                    return (
                      <label key={keyword} style={{ display: 'block', cursor: 'default', marginLeft: '10px' }}>
                        <input
                          type="checkbox"
                          checked={isPresent}
                          readOnly
                          style={{ marginRight: '5px' }}
                        />
                        {keyword}
                      </label>
                    );
                  })
                )}
              </details>
            )}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default CategoryCheckboxes;
