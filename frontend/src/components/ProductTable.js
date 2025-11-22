// frontend/src/components/ProductTable.js
import React, { useState } from "react";

const ProductTable = ({ products, onEdit, onDelete, onSelect }) => (
  <table>
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Unit</th>
        <th>Category</th>
        <th>Brand</th>
        <th>Stock</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((product) => {
        const status = product.stock === 0 ? "Out of Stock" : "In Stock";
        const color = product.stock === 0 ? "red" : "green";
        return (
          <tr key={product.id} onClick={() => onSelect(product.id)}>
            <td>
              {product.image ? (
                <img src={product.image} alt="thumb" width={40} height={40} />
              ) : (
                "No image"
              )}
            </td>
            <td>{product.name}</td>
            <td>{product.unit}</td>
            <td>{product.category}</td>
            <td>{product.brand}</td>
            <td>{product.stock}</td>
            <td>
              <span style={{ color }}>{status}</span>
            </td>
            <td>
              <button onClick={(e) => { e.stopPropagation(); onEdit(product); }}>
                Edit
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(product.id); }}>
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
);

export default ProductTable;
