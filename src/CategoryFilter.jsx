import React, { useState } from 'react';

// Colors for the four filter modes
const colors = {
  conditionalNegative: 'red',
  subtractiveNegative: '#DB7093', // purplish-pink
  conditionalPositive: 'green',
  additivePositive: 'turquoise'
};

function CategoryFilter({
  categoriesData,      // e.g. { "Coding": ["bash", "python"], ... }
  activeCategoryFilters,
  setActiveCategoryFilters,
  activeKeywordFilters,
  setActiveKeywordFilters,
  onEditCategories     // callback to App.js
}) {
  const [expanded, setExpanded] = useState({});
  const [newCategoryName, setNewCategoryName] = useState("");

  // For editing category names
  const [editingCat, setEditingCat] = useState(null);
  const [tempCatName, setTempCatName] = useState("");

  // For editing keyword names
  const [editingKeyword, setEditingKeyword] = useState(null);
  const [tempKeywordName, setTempKeywordName] = useState("");

  // Expand/collapse
  const toggleExpand = (cat) => {
    setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Toggle a filter mode for a given category.
  const toggleCategoryFilter = (cat, mode) => {
    setActiveCategoryFilters(prev => {
      const current = prev[cat] || {
        conditionalNegative: false,
        subtractiveNegative: false,
        conditionalPositive: false,
        additivePositive: false
      };
      return {
        ...prev,
        [cat]: { ...current, [mode]: !current[mode] }
      };
    });
  };

  // Toggle a filter mode for a given keyword.
  const toggleKeywordFilter = (keyword, mode) => {
    const key = keyword.toLowerCase();
    setActiveKeywordFilters(prev => {
      const current = prev[key] || {
        conditionalNegative: false,
        subtractiveNegative: false,
        conditionalPositive: false,
        additivePositive: false
      };
      return {
        ...prev,
        [key]: { ...current, [mode]: !current[mode] }
      };
    });
  };

  // CRUD: Add a new category
  const handleAddCategory = (e) => {
    e.preventDefault();
    const catName = newCategoryName.trim();
    if (catName) {
      onEditCategories({ type: 'ADD_CATEGORY', category: catName });
      setNewCategoryName("");
    }
  };

  // CRUD: Remove category
  const handleRemoveCategory = (cat) => {
    onEditCategories({ type: 'REMOVE_CATEGORY', category: cat });
  };

  // CRUD: Edit category
  const startEditingCategory = (cat) => {
    setEditingCat(cat);
    setTempCatName(cat);
  };
  const saveEditedCategory = (cat) => {
    const newName = tempCatName.trim();
    if (newName && newName !== cat) {
      onEditCategories({ type: 'EDIT_CATEGORY', category: cat, newCategory: newName });
    }
    setEditingCat(null);
    setTempCatName("");
  };

  // CRUD: Add a keyword
  const handleAddKeyword = (cat, keyword) => {
    const kw = keyword.trim();
    if (kw) {
      onEditCategories({ type: 'ADD_KEYWORD', category: cat, keyword: kw });
    }
  };

  // CRUD: Remove keyword
  const handleRemoveKeyword = (cat, keyword) => {
    onEditCategories({ type: 'REMOVE_KEYWORD', category: cat, keyword });
  };

  // CRUD: Edit keyword
  const startEditingKeyword = (cat, keyword) => {
    setEditingKeyword({ cat, keyword });
    setTempKeywordName(keyword);
  };
  const saveEditedKeyword = (cat, oldKeyword) => {
    const newKw = tempKeywordName.trim();
    if (newKw && newKw !== oldKeyword) {
      onEditCategories({ type: 'EDIT_KEYWORD', category: cat, keyword: oldKeyword, newKeyword: newKw });
    }
    setEditingKeyword(null);
    setTempKeywordName("");
  };

  // A helper style function for checkboxes using the given color
  const checkboxStyle = (color) => ({
    marginRight: '2px',
    accentColor: color,
    border: `1px solid ${color}`
  });

  return (
    <div style={{ marginBottom: '10px' }}>
      <h3>Filter by Category</h3>

      {/* Add new category */}
      <form onSubmit={handleAddCategory} style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="New category..."
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <button type="submit" style={{ marginLeft: '5px' }}>Add</button>
      </form>

      {Object.keys(categoriesData).map(cat => {
        const isEditingThisCat = (editingCat === cat);
        // Get filter state for this category (or default all false)
        const filterState = activeCategoryFilters[cat] || {
          conditionalNegative: false,
          subtractiveNegative: false,
          conditionalPositive: false,
          additivePositive: false
        };

        return (
          <div
            key={cat}
            style={{
              marginBottom: '10px',
              borderBottom: '1px solid #ddd',
              paddingBottom: '5px'
            }}
          >
            {/* Category row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              {/* Left side: expand/collapse + category name (or edit input) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <button
                  type="button"
                  onClick={() => toggleExpand(cat)}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    fontSize: '1rem'
                  }}
                >
                  {expanded[cat] ? '▼' : '▶'}
                </button>
                {isEditingThisCat ? (
                  <>
                    <input
                      type="text"
                      value={tempCatName}
                      onChange={(e) => setTempCatName(e.target.value)}
                      style={{ marginRight: '5px' }}
                    />
                    <button onClick={() => saveEditedCategory(cat)}>Save</button>
                    <button onClick={() => { setEditingCat(null); setTempCatName(""); }}>Cancel</button>
                  </>
                ) : (
                  <span>{cat}</span>
                )}
              </div>

              {/* Right side: checkboxes + Edit/Remove buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input
                  type="checkbox"
                  checked={filterState.conditionalNegative}
                  onChange={() => toggleCategoryFilter(cat, 'conditionalNegative')}
                  style={checkboxStyle(colors.conditionalNegative)}
                />
                <input
                  type="checkbox"
                  checked={filterState.subtractiveNegative}
                  onChange={() => toggleCategoryFilter(cat, 'subtractiveNegative')}
                  style={checkboxStyle(colors.subtractiveNegative)}
                />
                <input
                  type="checkbox"
                  checked={filterState.conditionalPositive}
                  onChange={() => toggleCategoryFilter(cat, 'conditionalPositive')}
                  style={checkboxStyle(colors.conditionalPositive)}
                />
                <input
                  type="checkbox"
                  checked={filterState.additivePositive}
                  onChange={() => toggleCategoryFilter(cat, 'additivePositive')}
                  style={checkboxStyle(colors.additivePositive)}
                />

                {!isEditingThisCat && (
                  <>
                    <button onClick={() => startEditingCategory(cat)}>
                      Edit
                    </button>
                    <button onClick={() => handleRemoveCategory(cat)}>
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* If expanded, show keywords for this category */}
            {expanded[cat] && (
              <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                {(!categoriesData[cat] || categoriesData[cat].length === 0) && (
                  <div style={{ fontStyle: 'italic', color: '#999' }}>No keywords</div>
                )}
                {categoriesData[cat] && categoriesData[cat].map(keyword => {
                  const kwLower = keyword.toLowerCase();
                  const kwFilterState = activeKeywordFilters[kwLower] || {
                    conditionalNegative: false,
                    subtractiveNegative: false,
                    conditionalPositive: false,
                    additivePositive: false
                  };
                  const isEditingThisKw =
                    editingKeyword && editingKeyword.cat === cat && editingKeyword.keyword === keyword;

                  return (
                    <div key={keyword} style={{ marginBottom: '5px' }}>
                      {/* Keyword row */}
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        {/* Left side: keyword text (or edit input) */}
                        <div>
                          {isEditingThisKw ? (
                            <>
                              <input
                                type="text"
                                value={tempKeywordName}
                                onChange={(e) => setTempKeywordName(e.target.value)}
                                style={{ marginRight: '5px' }}
                              />
                              <button onClick={() => saveEditedKeyword(cat, keyword)}>Save</button>
                              <button onClick={() => { setEditingKeyword(null); setTempKeywordName(""); }}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <span>{keyword}</span>
                          )}
                        </div>

                        {/* Right side: checkboxes + Edit/Remove */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <input
                            type="checkbox"
                            checked={kwFilterState.conditionalNegative}
                            onChange={() => toggleKeywordFilter(keyword, 'conditionalNegative')}
                            style={checkboxStyle(colors.conditionalNegative)}
                          />
                          <input
                            type="checkbox"
                            checked={kwFilterState.subtractiveNegative}
                            onChange={() => toggleKeywordFilter(keyword, 'subtractiveNegative')}
                            style={checkboxStyle(colors.subtractiveNegative)}
                          />
                          <input
                            type="checkbox"
                            checked={kwFilterState.conditionalPositive}
                            onChange={() => toggleKeywordFilter(keyword, 'conditionalPositive')}
                            style={checkboxStyle(colors.conditionalPositive)}
                          />
                          <input
                            type="checkbox"
                            checked={kwFilterState.additivePositive}
                            onChange={() => toggleKeywordFilter(keyword, 'additivePositive')}
                            style={checkboxStyle(colors.additivePositive)}
                          />

                          {!isEditingThisKw && (
                            <>
                              <button onClick={() => startEditingKeyword(cat, keyword)}>
                                Edit
                              </button>
                              <button onClick={() => handleRemoveKeyword(cat, keyword)}>
                                Remove
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Add a new keyword */}
                <AddKeywordForm onAdd={(kw) => handleAddKeyword(cat, kw)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// Simple form to add a new keyword
function AddKeywordForm({ onAdd }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onAdd(value.trim());
      setValue("");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '5px' }}>
      <input
        type="text"
        placeholder="New keyword..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" style={{ marginLeft: '5px' }}>Add</button>
    </form>
  );
}

export default CategoryFilter;
