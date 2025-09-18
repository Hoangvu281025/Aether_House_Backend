import React, { useState, useRef, useEffect } from "react";
import "./Header.css";
import { FaBars, FaSearch, FaMoon, FaBell } from "react-icons/fa";
import { Logout } from "../../pages/Auth/logout";
const Header = () => {
  const user = JSON.parse(localStorage.getItem("user"))
  const [openMenu, setOpenMenu] = useState(false);
  const userRef = useRef(null);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      {/* Left section */}
      <div className="header-left">
        {/* <button className="menu-btn">
          <FaBars className="icon" />
        </button> */}

        {/* <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search or type command..." />
          <span className="shortcut">⌘K</span>
        </div> */}
      </div>

      {/* Right section */}
      <div className="header-right">
        {/* <button className="icon-btn">
          <FaMoon className="icon" />
        </button> */}
{/* 
        <button className="icon-btn notify">
          <FaBell className="icon" />
          <span className="dot"></span>
        </button> */}

        <div
          className="user"
          ref={userRef}
          onClick={() => setOpenMenu(!openMenu)}
        >
          <img
            src={user.avatar.url}
            alt="user avatar"
            className="avatar"
          />
          <span className="username">{user.name}</span>
          <span className="arrow-head">▾</span>

          {openMenu && (
            <div className="dropdown">
              <button className="dropdown-item">Profile</button>
              <button className="dropdown-item logout" onClick={Logout}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
