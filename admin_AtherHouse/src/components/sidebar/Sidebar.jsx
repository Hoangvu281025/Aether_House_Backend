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
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <>
      {/* Logo */}
      <div className="sidebar-header">
        <img
            src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757224196/Untitled-1_nru9av.png"
            alt="user avatar"
            className="logo_sidebar"
          />
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
          <li>
            <button
              className="dropdown-btn"
              onClick={() => toggleMenu("ecommerce")}
            >
              <FaShoppingCart /> <span>E-commerce</span>
              <span className="arrow">
                {openMenu === "ecommerce" ? <FaAngleDown /> : <FaAngleRight />}
              </span>
            </button>
            {openMenu === "ecommerce" && (
              <ul className="submenu">
                <li>
                  <NavLink to="/ecommerce/products">Products</NavLink>
                </li>
                <li>
                  <NavLink
                    to="/ecommerce/add-product"
                    className={({ isActive }) => (isActive ? "active-link" : "")}
                  >
                    Add Product
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          <li>
            <NavLink to="/calendar">
              <FaCalendarAlt /> <span>Calendar</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <FaUser /> <span>User Profile</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/tasks">
              <FaTasks /> <span>Task</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/formproduct">
              <FaWpforms /> <span>Forms</span>
            </NavLink>
          </li>

          {/* Tables dropdown */}
          <li>
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
                  <NavLink to="/tables/users">User Table</NavLink>
                </li>
              </ul>
            )}
          </li>


          <li>
            <NavLink to="/pages">
              <FaFile /> <span>Pages</span>
            </NavLink>
          </li>
        </ul>
      </div>
   </>
  );
};

export default Sidebar;
