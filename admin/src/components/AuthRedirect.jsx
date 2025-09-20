import { Navigate, Outlet } from "react-router-dom";

export default function AuthRedirect() {
  const token = localStorage.getItem("token");
  // Nếu đã đăng nhập -> đẩy về /home
  if (token) return <Navigate to="/home" replace />;
  // Chưa đăng nhập -> cho vào các trang auth bên trong (signin/signup)
  return <Outlet />;
}
