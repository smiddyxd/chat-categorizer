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

function CategoryFilter({ activeFilters, setActiveFilters }) {
  const toggleCategory = (cat) => {
    if (activeFilters.includes(cat)) {
      // remove
      setActiveFilters(activeFilters.filter(c => c !== cat));
    } else {
      // add
      setActiveFilters([...activeFilters, cat]);
    }
  };

  return (
    <div style={{ marginBottom: '10px' }}>
      <h3>Filter by Category</h3>
      {ALL_CATEGORIES.map(cat => (
        <label key={cat} style={{ display: 'block', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={activeFilters.includes(cat)}
            onChange={() => toggleCategory(cat)}
          />
          {cat}
        </label>
      ))}
    </div>
  );
}

export default CategoryFilter;
