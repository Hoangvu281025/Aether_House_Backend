import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"
import AuthLayout from "./Layout/AuthLayout";
import MainLayout from "./Layout/MainLayout";
import Signin from "./pages/Auth/Signin";
import Verify from "./pages/Auth/Verify";
import Dashboard from "./pages/home/Dashboard";
import Addproduct from "./pages/forms/Addproduct";  
import FormProductUpdate from "./pages/forms/Updateproduct"
import Products from "./pages/products/Products";
import AddStore from "./pages/forms/AddStore";
import Users from "./pages/users/Users";
import Stores from "./pages/Stores/Stores";
import ProtectedRoute from "./components/ProtectedRoute";

import AuthRedirect from "./components/AuthRedirect";
import Admins from "./pages/users/Admins";
import Profile from "./pages/Profile/Profile";
import RequireSuperAdmin from "./components/RequireSuperAdmin";
import { Logout } from "./pages/Auth/logout";
import Category from "./pages/category/Category";
import Voucher from "./pages/Voucher/Voucher";
import Orders from "./pages/Orders/Orders";
import OrderDetail from "./pages/Orders/OrderDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout chính */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/product" element={<Products />} />
            <Route path="/forms/add-product" element={<Addproduct />} /> 
            <Route path="/forms/update-product/" element={<FormProductUpdate />} /> 
            <Route path="/forms/add-store/" element={<AddStore />} /> 
            <Route path="/user" element={<Users />} />
            <Route path="/category" element={<Category />} />
            <Route path="/voucher" element={<Voucher />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetail />} />
           <Route element={<RequireSuperAdmin />}>
              <Route path="/admin" element={<Admins />} />
            </Route>
            <Route path="/store" element={<Stores />} />
            <Route path="/Profile" element={<Profile />} />
            <Route path="/logout" element={<Logout />} />
          </Route>
        </Route>
        {/* Auth layout */}
        <Route element={<AuthRedirect />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Signin />} />
            <Route path="/Verify" element={<Verify />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
