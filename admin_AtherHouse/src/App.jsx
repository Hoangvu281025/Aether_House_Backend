import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthLayout from "./Layout/AuthLayout";
import MainLayout from "./Layout/MainLayout";
import Signin from "./pages/Auth/Signin";
import Signup from "./pages/Auth/Signup";
import Dashboard from "./pages/home/Dashboard";
import Addproduct from "./pages/ecommerce/Addproduct";  
import FormProductUpdate from "./pages/ecommerce/Updateproduct"
import Products from "./pages/ecommerce/Products";
import Users from "./pages/users/Users";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css"
import AuthRedirect from "./components/AuthRedirect";
function App() {
  return (
    <Router>
      <Routes>
        {/* Layout chính */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/ecommerce/products" element={<Products />} />
            <Route path="/ecommerce/add-product" element={<Addproduct />} /> 
            <Route path="/ecommerce/update-product/" element={<FormProductUpdate />} /> 
            <Route path="/tables/users" element={<Users />} />
          </Route>
        </Route>
        {/* Auth layout */}
        <Route element={<AuthRedirect />}>
          <Route element={<AuthLayout />}>
            <Route path="/" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
