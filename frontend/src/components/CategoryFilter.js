// frontend/src/components/CategoryFilter.js
import React from "react";
const CategoryFilter = ({ categories, onFilter }) => (
  <select onChange={(e) => onFilter(e.target.value)}>
    <option value="">All Categories</option>
    {categories.map((cat) => (
      <option key={cat}>{cat}</option>
    ))}
  </select>
);
export default CategoryFilter;