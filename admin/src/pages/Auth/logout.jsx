import api from "../../lib/axios"
export const Logout = async () => {
  try {
    const token = localStorage.getItem("token");

    if (token) {
      await api.post("/auth/logout");
    }
   
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    // Dù thành công hay không thì cũng xóa local
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("token_expiry");
     window.location.href = "/";
  }
};
