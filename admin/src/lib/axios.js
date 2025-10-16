import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
    //"https://bqvjkcqv-3000.asse.devtunnels.ms/api",
  headers: { "Content-Type": "application/json" },
});

// Gắn token vào header cho mọi request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.token = `Bearer ${token}`;
//   return config;
// });

// Nếu token hết hạn → backend trả 401 → xoá localStorage & quay về login
// api.interceptors.request.use((config) => {
//   const expiry = Number(localStorage.getItem("token_expiry") || 0);

//   if (expiry && Date.now() >= expiry) {
//     localStorage.removeItem("token");
//     localStorage.removeItem("token_expiry");
//     localStorage.removeItem("user");
//     setTimeout(() => (window.location.href = "/"), 50);
//     return Promise.reject(new Error("Token expired"));
//   }

 

//   return config;
// });


api.interceptors.request.use((config) => {
  const token  = localStorage.getItem("token");
  const expiry = Number(localStorage.getItem("token_expiry") || 0);

  if (expiry && Date.now() >= expiry) {
    setTimeout(() => (window.location.href = "/logout"), 50);
    return Promise.reject(new Error("Token expired"));
  }
  
  if (token) config.headers.token = `Bearer ${token}`;
  return config;
});



export default api;
