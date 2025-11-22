// frontend/src/components/ExportButton.js
import React from "react";
const ExportButton = () => (
  <button
    onClick={() => {
      window.open("http://localhost:5000/api/products/export", "_blank");
    }}
  >
    Export CSV
  </button>
);
export default ExportButton;
