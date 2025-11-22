// frontend/src/components/EditRow.js
import React, { useState } from "react";
const EditRow = ({ product, onSave, onCancel }) => {
  const [form, setForm] = useState({ ...product });
  return (
    <tr>
      <td>
        {product.image ? (
          <img src={product.image} alt="thumb" width={40} height={40} />
        ) : (
          "No image"
        )}
      </td>
      <td>
        <input
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />
      </td>
      <td>
        <input
          value={form.unit}
          onChange={(e) =>
            setForm({ ...form, unit: e.target.value })
          }
        />
      </td>
      <td>
        <input
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
        />
      </td>
      <td>
        <input
          value={form.brand}
          onChange={(e) =>
            setForm({ ...form, brand: e.target.value })
          }
        />
      </td>
      <td>
        <input
          type="number"
          value={form.stock}
          min={0}
          onChange={(e) =>
            setForm({ ...form, stock: parseInt(e.target.value) })
          }
        />
      </td>
      <td>
        <select
          value={form.status}
          onChange={(e) =>
            setForm({ ...form, status: e.target.value })
          }
        >
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </td>
      <td>
        <button onClick={() => onSave(form)}>Save</button>
        <button onClick={onCancel}>Cancel</button>
      </td>
    </tr>
  );
};
export default EditRow;
