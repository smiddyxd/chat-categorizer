import React, { useState } from 'react';

function CategoryFilter({
  categoriesData,      // e.g. { "Coding": ["bash", "python"], ... }
  activeFilters,
  setActiveFilters,
  activeKeywords,
  setActiveKeywords,
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

  // Toggle category in activeFilters
  const toggleCategory = (cat) => {
    if (activeFilters.includes(cat)) {
      setActiveFilters(activeFilters.filter(c => c !== cat));
    } else {
      setActiveFilters([...activeFilters, cat]);
    }
  };

  // Toggle a keyword in activeKeywords
  const toggleKeyword = (keyword) => {
    const kwLower = keyword.toLowerCase();
    if (activeKeywords.includes(kwLower)) {
      setActiveKeywords(activeKeywords.filter(k => k !== kwLower));
    } else {
      setActiveKeywords([...activeKeywords, kwLower]);
    }
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
        const catExpanded = !!expanded[cat];
        const isCatChecked = activeFilters.includes(cat);
        const keywords = categoriesData[cat] || [];

        const isEditingThisCat = (editingCat === cat);

        return (
          <div key={cat} style={{ marginBottom: '5px' }}>
            {/* Category row */}
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
                <>
                  <label style={{ cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={isCatChecked}
                      onChange={() => toggleCategory(cat)}
                      style={{ marginRight: '5px' }}
                    />
                    {cat}
                  </label>
                  <button onClick={() => startEditingCategory(cat)} style={{ marginLeft: '5px' }}>
                    Edit
                  </button>
                  <button onClick={() => handleRemoveCategory(cat)} style={{ marginLeft: '5px' }}>
                    Remove
                  </button>
                </>
              )}
            </div>

            {/* If expanded, show keywords */}
            {catExpanded && (
              <div style={{ marginLeft: '20px', marginTop: '5px' }}>
                {keywords.length === 0 && <div style={{ fontStyle: 'italic', color: '#999' }}>No keywords</div>}
                {keywords.map(keyword => {
                  const kwLower = keyword.toLowerCase();
                  const isKeywordChecked = activeKeywords.includes(kwLower);
                  const isEditingThisKw = editingKeyword && editingKeyword.cat === cat && editingKeyword.keyword === keyword;

                  return (
                    <div key={keyword} style={{ display: 'flex', alignItems: 'center', marginLeft: '5px' }}>
                      <label style={{ cursor: 'pointer', flex: 1 }}>
                        <input
                          type="checkbox"
                          checked={isKeywordChecked}
                          onChange={() => toggleKeyword(keyword)}
                          style={{ marginRight: '5px' }}
                        />
                        {isEditingThisKw ? (
                          <>
                            <input
                              type="text"
                              value={tempKeywordName}
                              onChange={(e) => setTempKeywordName(e.target.value)}
                              style={{ marginRight: '5px' }}
                            />
                            <button onClick={() => saveEditedKeyword(cat, keyword)}>Save</button>
                            <button onClick={() => { setEditingKeyword(null); setTempKeywordName(""); }}>Cancel</button>
                          </>
                        ) : (
                          <>
                            {keyword}
                          </>
                        )}
                      </label>
                      {!isEditingThisKw && (
                        <>
                          <button onClick={() => startEditingKeyword(cat, keyword)} style={{ marginLeft: '5px' }}>
                            Edit
                          </button>
                          <button onClick={() => handleRemoveKeyword(cat, keyword)} style={{ marginLeft: '5px' }}>
                            Remove
                          </button>
                        </>
                      )}
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
      <div style={{ marginBottom: '10px' }}>
        <label style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={activeFilters.includes("uncategorized")}
            onChange={() => toggleCategory("uncategorized")}
            style={{ marginRight: '5px' }}
          />
          Uncategorized
        </label>
      </div>
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
