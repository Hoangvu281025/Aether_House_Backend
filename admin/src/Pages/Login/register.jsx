// import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const AdminRegister = () => {

  return (
    <div className="signup-container">
      <div className="signup-container">
      <div className="signup-box">
        {/* Logo */}
        <img className="logo" src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757224196/Untitled-1_nru9av.png" alt="" />

        {/* Tiêu đề */}
        <h2 className="title">Sign up</h2>

        {/* Form */}
        <form  className="form">
          <div className="input_label">
            <input
              className="input_admin"
              type="email"
              name="email"
              placeholder="Email"
              required
            />

          </div>
          <div className="input_label">
            <input
              className="input_admin"
              type="password"
              name="password"
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="btn_login_admin" disabled>Login</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AdminRegister;
