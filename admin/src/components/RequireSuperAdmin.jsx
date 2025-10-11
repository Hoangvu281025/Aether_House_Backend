// RequireSuperAdmin.jsx
import { Navigate, Outlet } from "react-router-dom";

const RequireSuperAdmin = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.role_id?.name !== "superadmin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RequireSuperAdmin;
