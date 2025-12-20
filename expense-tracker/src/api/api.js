import axios from "axios";

const api = axios.create({
  baseURL: "https://YOUR_API_GATEWAY_URL",
});

export default api;
