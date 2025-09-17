import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // withCredentials: true, // bật nếu BE dùng cookie httpOnly
  headers: { "Content-Type": "application/json" },
});

// (optional) bắt lỗi chuẩn
api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);


// đính kèm Authorization cho mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.token = `Bearer ${token}`;
  return config;
});

// nếu token hết hạn → 401 → dọn sạch & quay về login
// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err?.response?.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/"; // login
//     }
//     return Promise.reject(err);
//   }
// );
export default api;
