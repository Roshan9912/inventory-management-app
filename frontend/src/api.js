// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://verbose-potato-r4p9v6pvrv9q365q-5000.app.github.dev/api"
});

export default api;
