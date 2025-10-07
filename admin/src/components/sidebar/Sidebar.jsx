import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaShoppingCart,
  FaCalendarAlt,
  FaUser,
  FaTasks,
  FaWpforms,
  FaTable,
  FaFile,
  FaAngleDown,
  FaAngleRight
} from "react-icons/fa";
import "./Sidebar.css";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"))



  return (
    <>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="user_sidebar">
          <div className="avatar_sidebar">
            {/* <img
              src={user.avatar.url}
              alt="avatar"
              className="avatar_img_sidebar"
            /> */}
            <span className="role_sidebar">{user.role_id.name}</span>
            <span className="username_sidebar">{user.email}</span>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="sidebar-section">
        <p className="section-title">MENU</p>
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/home" end>
              <FaTachometerAlt /> <span>Dashboard</span>
            </NavLink>
          </li>

          {/* E-commerce dropdown */}
          {/* <li>
            <button
              className="dropdown-btn"
              onClick={() => toggleMenu("ecommerce")}
            >
              <FaWpforms /> <span>Forms</span>
              <span className="arrow">
                {openMenu === "ecommerce" ? <FaAngleDown /> : <FaAngleRight />}
              </span>
            </button>
            {openMenu === "ecommerce" && (
              <ul className="submenu">
               
                <li>
                  <NavLink
                    to="/forms/add-product"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    Add Product
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/forms/add-store"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    Add Store
                  </NavLink>
                </li>
              </ul>
            )}
          </li> */}


        

          {/* Tables dropdown */}
          {/* <li>
            <button
              className="dropdown-btn"
              onClick={() => toggleMenu("tables")}
            >
              <FaTable /> <span>Tables</span>
              <span className="arrow">
                {openMenu === "tables" ? <FaAngleDown /> : <FaAngleRight />}
              </span>
            </button>
            {openMenu === "tables" && (
              <ul className="submenu">
                <li>
                  <NavLink to="/tables/admins">Admins</NavLink>
                </li>
                <li>
                  <NavLink to="/tables/users">Users</NavLink>
                </li>
                 <li>
                  <NavLink to="/tables/products">Products</NavLink>
                </li>
                 <li>
                  <NavLink to="/tables/stores">Stores</NavLink>
                </li>
              </ul>
            )}
          </li> */}

            {user.role_id.name === "superadmin" && (
              <li>
                <NavLink to="/admin">
                  <FaFile /> <span>Manage Admin</span>
                </NavLink>
              </li>
            )}
          <li>
            <NavLink to="/user">
              <FaFile /> <span>Manage User</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/store">
              <FaFile /> <span>Manage Store</span>
            </NavLink>
          </li>
        </ul>
      </div>
   </>
  );
};

export default Sidebar;
