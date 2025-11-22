// frontend/src/App.js
import React, { useState, useEffect } from "react";
import api from "./api";
import ProductTable from "./components/ProductTable";
import EditRow from "./components/EditRow";
import SearchBar from "./components/SearchBar";
import CategoryFilter from "./components/CategoryFilter";
import ImportButton from "./components/ImportButton";
import ExportButton from "./components/ExportButton";
import HistorySidebar from "./components/HistorySidebar";

function App() {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState(null);

  // Load products
  useEffect(() => {
    const url =
      search
        ? `/products/search?name=${search}`
        : '/products';
    api.get(url).then(res => {
      const filtered =
        category
          ? res.data.filter(p => p.category === category)
          : res.data;
      setProducts(filtered);
    });
  }, [search, category]);

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Edit logic
  const handleEditSave = async (data) => {
    await api.put(`/products/${editingId}`, { ...data, changedBy: "admin" });
    setEditingId(null);
    setSearch(''); // reload all
  };

  return (
    <div>
      <header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <SearchBar onSearch={setSearch} />
          <CategoryFilter categories={categories} onFilter={setCategory} />
          <button>Add New Product</button>
        </div>
        <div>
          <ImportButton onSuccess={() => setSearch('')} />
          <ExportButton />
        </div>
      </header>
      <main>
        <table>
          <tbody>
            {products.map((product) =>
              editingId === product.id
                ? (
                  <EditRow
                    product={product}
                    onSave={handleEditSave}
                    onCancel={() => setEditingId(null)}
                  />
                )
                : <ProductTable
                  products={[product]}
                  onEdit={() => setEditingId(product.id)}
                  onDelete={async (id) => {
                    // implement delete API
                  }}
                  onSelect={setSelected}
                />
            )}
          </tbody>
        </table>
        {selected && <HistorySidebar productId={selected} onClose={() => setSelected(null)} />}
      </main>
    </div>
  );
}

export default App;
