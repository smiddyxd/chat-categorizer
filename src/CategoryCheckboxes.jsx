import React, { useState } from 'react';

function CategoryCheckboxes(props) {

    // Local state to track expanded categories
    const [expanded, setExpanded] = useState({});

  // If props.selectedChats exists and has length > 0, we're in bulk mode
  if (props.selectedChats && props.selectedChats.length > 0) {
    const { selectedChats, onBulkCategoryUpdate, categoriesData } = props;
    // Compute intersection of categories
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
      if (onBulkCategoryUpdate) {
        onBulkCategoryUpdate(category, !isShared);
      }
    };

    return (
      <div style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <h3>Assign Categories (Bulk)</h3>
        {Object.keys(categoriesData).map(cat => {
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
  }
  // ------------------------------
  // SINGLE-CHAT MODE
  // ------------------------------
  else if (props.chat) {
    const { chat, onUpdate, categoriesData } = props;
    const chatCategories = chat.categories || [];
    // Combine the chat title and messages for keyword matching
    const combinedText = ((chat.title || "") + " " + (chat.chats || []).join(" ")).toLowerCase();

    const toggleExpand = (cat) => {
      setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
    };

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
        {Object.keys(categoriesData).map(cat => {
          const isChecked = chatCategories.includes(cat);
          const keywords = categoriesData[cat] || [];

          return (
            <div key={cat}>
              {/* Category row with arrow + checkbox */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                {/* Arrow: expand/collapse */}
                <button
                  type="button"
                  onClick={() => toggleExpand(cat)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {expanded[cat] ? '▼' : '▶'}
                </button>

                {/* Category checkbox */}
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(cat)}
                  style={{ marginRight: '5px' }}
                />
                <span onClick={() => toggleExpand(cat)}>
                  {cat}
                </span>
              </div>

              {/* Keyword list, shown only if expanded */}
              {expanded[cat] && (
                <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                  {keywords.length === 0 ? (
                    <div style={{ fontStyle: 'italic', color: '#999' }}>No keywords</div>
                  ) : (
                    keywords.map(keyword => {
                      const kwLower = keyword.toLowerCase();
                      const isPresent = combinedText.includes(kwLower);
                      return (
                        <label
                          key={keyword}
                          style={{ display: 'block', cursor: 'default', marginLeft: '5px' }}
                        >
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return null;
}

export default CategoryCheckboxes;
