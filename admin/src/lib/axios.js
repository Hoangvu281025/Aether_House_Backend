import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Gắn token vào header cho mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.token = `Bearer ${token}`;
  return config;
});

// Nếu token hết hạn → backend trả 401 → xoá localStorage & quay về login
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/"; // trang login
//     }
//     return Promise.reject(err);
//   }
// );

export default api;
