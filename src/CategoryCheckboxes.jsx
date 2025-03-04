import React from 'react';

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
  // Check if we're in single-chat mode or multi-chat mode
  const { chat, selectedChats, onUpdate, onBulkCategoryUpdate } = props;

  if (selectedChats && selectedChats.length > 0) {
    // MULTI-CHAT MODE
    // 1) Compute intersection of categories across all selected chats
    const sharedCategories = selectedChats.reduce((acc, c, index) => {
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
      // If isShared, remove from all; else add to all
      if (onBulkCategoryUpdate) {
        onBulkCategoryUpdate(category, !isShared);
      }
    };

    return (
      <div style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h3>Assign Categories (Bulk)</h3>
        {ALL_CATEGORIES.map(cat => {
          const isChecked = sharedCategories.has(cat);
          return (
            <label key={cat} style={{ display: 'block', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggleCategory(cat)}
              />
              {cat}
            </label>
          );
        })}
      </div>
    );

  } else if (chat) {
    // SINGLE-CHAT MODE
    const { categories = [] } = chat;

    const handleToggle = (cat) => {
      let updatedCategories;
      if (categories.includes(cat)) {
        updatedCategories = categories.filter(c => c !== cat);
      } else {
        updatedCategories = [...categories, cat];
      }
      if (onUpdate) {
        onUpdate(chat, updatedCategories);
      }
    };

    return (
      <div style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h3>Assign Categories (Single Chat)</h3>
        {ALL_CATEGORIES.map(cat => (
          <label key={cat} style={{ display: 'block', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={categories.includes(cat)}
              onChange={() => handleToggle(cat)}
            />
            {cat}
          </label>
        ))}
      </div>
    );
  }

  // If neither single nor multi, show nothing
  return null;
}

export default CategoryCheckboxes;
