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

function CategoryCheckboxes({ chat, onUpdate }) {
  const { categories = [] } = chat;

  const handleToggle = (cat) => {
    let updatedCategories;
    if (categories.includes(cat)) {
      // remove category
      updatedCategories = categories.filter(c => c !== cat);
    } else {
      // add category
      updatedCategories = [...categories, cat];
    }
    onUpdate(chat, updatedCategories);
  };

  return (
    <div style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
      <h3>Assign Categories</h3>
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

export default CategoryCheckboxes;
