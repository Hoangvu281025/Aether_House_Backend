export const Logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("token_expiry");
  window.location.href = "/"; 
};
