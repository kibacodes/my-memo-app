import React from "react";

export default function CategoryList({
  categories,
  expandedId,
  memosByCategory,
  onCategoryClick,
  onMemoClick,
}) {
  return (
    <div className="category-list">
      {categories.map((cat) => (
        <div key={cat.id} id={`category-${cat.id}`} className="category-item">
          <div
            id={`category${cat.id}-title`}
            className="category-title"
            onClick={() => onCategoryClick(cat.id)}
          >
            {cat.name}
          </div>

          {expandedId === cat.id &&
            (memosByCategory[cat.id] || []).map((memo) => (
              <div
                key={memo.id}
                id={`memo-${memo.id}`}
                className="memo-item"
                onClick={() => onMemoClick(memo.id)}
              >
                {memo.title}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}
