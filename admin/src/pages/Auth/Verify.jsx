import React from "react";
import { useState } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import {Link} from "react-router-dom";
import api from "../../lib/axios"
import "./Auth.css";

const Verify = () => {
  const navigate  = useNavigate();
  const location = useLocation();
  const savedEmail = location.state?.Email;
  const [otp , SetOtp] = useState('');
  const [error , SetError] = useState('');
  
  


  const handleRegister = async(e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify" , {email:savedEmail , otp});
      const { accessToken, user } = res.data || {};

    if (accessToken) {
      localStorage.setItem("token", accessToken);
      localStorage.setItem("token_expiry", String(Date.now() + 60 * 60 * 1000)); // 1 giờ (lưu dạng string)
      localStorage.setItem("user", JSON.stringify(user));
    }
      await new Promise((r) => setTimeout(r, 2000));
      navigate("/home", { replace: true });

    } catch (err) {
      const res  = err.response || {};
      const data = res.data || {};
      SetError(data.message || "");
    }
  }
  return (
    <div className="signup-container">
      {/* Left Side - Form */}
      <div className="signup-left">
       
        <h2 className="signup-title">Enter code</h2>
        <p className="signup-subtitle">Sent to {savedEmail}</p>

        <form className="signup-form" onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="6-digit code" 
            required 
            onChange={(e) => SetOtp(e.target.value)}
          />
          {error && <p className="error">{error}</p>}

          <button type="submit" className="signup-btn" >
            Submit
          </button>
        </form>

        <p className="login-text">
          <Link to="/">Sign in with a different email</Link>
        </p>
      </div>

    

      {/* Right Side - Banner */}
      <div className="signup-right">
       <div className="logo">
          <img src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757820104/Untitled-1-white_lpecjw.png" alt="" />
        </div>
        <img className="image_banner" src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757577577/background_1_lsoh5u.webp" alt="Banner" />
     
      </div>
    </div>
  );
};

export default Verify;
