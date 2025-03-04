import React, { useState } from 'react';

function CategoryFilter({
  categoriesData,      // e.g. { "Coding": ["bash", "python"], ... }
  activeFilters,       // array of category names (e.g. ["Coding", "MBTI"])
  setActiveFilters,
  activeKeywords,      // array of keyword strings (lowercase)
  setActiveKeywords
}) {
  // Local state to track which categories are expanded
  const [expanded, setExpanded] = useState({});

  // Toggle expansion arrow for a category
  const toggleExpand = (cat) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Toggle an entire category in activeFilters
  const toggleCategory = (cat) => {
    if (activeFilters.includes(cat)) {
      // remove
      setActiveFilters(activeFilters.filter(c => c !== cat));
    } else {
      // add
      setActiveFilters([...activeFilters, cat]);
    }
  };

  // Toggle a keyword in activeKeywords
  const toggleKeyword = (keyword) => {
    const kwLower = keyword.toLowerCase(); // store or compare in lowercase
    if (activeKeywords.includes(kwLower)) {
      // remove
      setActiveKeywords(activeKeywords.filter(k => k !== kwLower));
    } else {
      // add
      setActiveKeywords([...activeKeywords, kwLower]);
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <h3>Filter by Category</h3>
      {Object.keys(categoriesData).map(cat => {
        const catExpanded = !!expanded[cat];
        const isCatChecked = activeFilters.includes(cat);
        const keywords = categoriesData[cat] || [];

        return (
          <div key={cat} style={{ marginBottom: '5px' }}>
            {/* Category row with arrow and checkbox */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => toggleExpand(cat)}
                style={{
                  marginRight: '5px',
                  cursor: 'pointer',
                  background: 'none',
                  border: 'none',
                  fontSize: '1rem'
                }}
              >
                {catExpanded ? '▼' : '▶'}
              </button>
              <label style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isCatChecked}
                  onChange={() => toggleCategory(cat)}
                  style={{ marginRight: '5px' }}
                />
                {cat}
              </label>
            </div>

            {/* If expanded, show keywords */}
            {catExpanded && (
              <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                {keywords.length === 0 ? (
                  <div style={{ fontStyle: 'italic', color: '#999' }}>No keywords</div>
                ) : (
                  keywords.map(keyword => {
                    const kwLower = keyword.toLowerCase();
                    const isKeywordChecked = activeKeywords.includes(kwLower);
                    return (
                      <label
                        key={keyword}
                        style={{ display: 'block', cursor: 'pointer', marginLeft: '5px' }}
                      >
                        <input
                          type="checkbox"
                          checked={isKeywordChecked}
                          onChange={() => toggleKeyword(keyword)}
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

export default CategoryFilter;
