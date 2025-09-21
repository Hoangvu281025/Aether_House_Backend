import React, { useState } from "react";
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

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <>
      {/* Logo */}
      <div className="sidebar-header">
        {/* <img
            src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757224196/Untitled-1_nru9av.png"
            alt="user avatar"
            className="logo_sidebar"
          /> */}
        <div className="user_sidebar">
          <div className="avatar_sidebar">
            <img
              src={user.avatar.url}
              alt="avatar"
              className="avatar_img_sidebar"
            />
            <span className="username_sidebar">{user.name}</span>
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


          <li>
            <NavLink to="/tables/admins">
              <FaFile /> <span>Manage Admin</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tables/users">
              <FaFile /> <span>Manage User</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tables/stores">
              <FaFile /> <span>Manage Store</span>
            </NavLink>
          </li>
        </ul>
      </div>
   </>
  );
};

export default Sidebar;
