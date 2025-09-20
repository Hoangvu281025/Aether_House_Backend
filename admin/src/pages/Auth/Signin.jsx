import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios"

import {Link} from "react-router-dom";
import "./Auth.css";
const MIN_PASS = 6;
const Signin = () => {
    const navigate  = useNavigate();
    const [Email , SetEmail] = useState('');
    const [Password , SetPassword] = useState('');
    const [error, setError]         = useState("");
    const [success, setSuccess]     = useState("");
    const [loading, setLoading]     = useState(false);

    const handleSubmit = async(e) =>{
      e.preventDefault()
      setError('');
      setSuccess('');
      const email = Email.trim();             
      const pwd = Password;    
      if (pwd.length < MIN_PASS) return setError(`Mật khẩu phải lớn hơn hoặc bằng ${MIN_PASS} ký tự`);
      try {
      setLoading(true);
      const newUser = {
        email, 
        password: pwd
      };

      const { data } = await api.post("/auth/login" , newUser);

      if(data?.accessToken){
        localStorage.setItem('token' , data.accessToken)
      }

      localStorage.setItem('user' , JSON.stringify(data))


      setSuccess(data?.message || "Đăng nhập thành công!");

     
      SetEmail("");
      SetPassword("");

      await new Promise((r) => setTimeout(r, 900));
      navigate("/home", { replace: true });

    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Có lỗi xảy ra";
      setError(msg);
      
    }finally{
      setLoading(false)
    }
    }
  return (
    <div className="signup-container">
      {/* Left Form */}
      <div className="signup-left">
        <h2 className="signup-title">Sign In</h2>
        <p className="signup-subtitle">Create your account to get started!</p>


        <form className="signup-form" onSubmit={handleSubmit}>
          <label>Email *</label>
          <input 
            type="email" 
            placeholder="info@gmail.com" 
            required 
            onChange={(e) => SetEmail(e.target.value)}
          />

          <label>Password *</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            required 
            onChange={(e) => SetPassword(e.target.value)}
          />

          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign in"}
          </button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>

      {/* Right Banner */}
      <div className="signup-right">
        <div className="logo">
          <img src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757820104/Untitled-1-white_lpecjw.png" alt="" />
        </div>
        <img className="image_banner" src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757577575/background_2_efgu4s.webp" alt="Banner" />
      </div>

    </div>
  );
};

export default Signin;
