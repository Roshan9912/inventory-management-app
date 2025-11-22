// frontend/src/components/ImportButton.js
import React, { useRef } from "react";
import api from "../api";
const ImportButton = ({ onSuccess }) => {
  const inputRef = useRef();
  const handleFile = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("csvFile", file);
    await api.post("/products/import", formData);
    onSuccess();
  };
  return (
    <>
      <button onClick={() => inputRef.current.click()}>Import CSV</button>
      <input
        style={{ display: "none" }}
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFile}
      />
    </>
  );
};
export default ImportButton;

