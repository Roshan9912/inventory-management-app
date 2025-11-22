// frontend/src/components/HistorySidebar.js
import React, { useEffect, useState } from "react";
import api from "../api";
const HistorySidebar = ({ productId, onClose }) => {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    api.get(`/products/${productId}/history`).then(res => setLogs(res.data))
  }, [productId]);
  return (
    <div style={{
      position: 'fixed',
      right: 0, top: 0, width: 300, height: '100%', background: '#fafafa', borderLeft: '1px solid #ccc', padding: 20
    }}>
      <button onClick={onClose}>Close</button>
      <h3>Inventory History</h3>
      <table>
        <thead>
          <tr>
            <th>Date</th><th>Old</th><th>New</th><th>By</th><th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id}>
              <td>{new Date(log.timestamp).toLocaleString()}</td>
              <td>{log.oldStock}</td>
              <td>{log.newStock}</td>
              <td>{log.changedBy}</td>
              <td>{log.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default HistorySidebar;
