import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom";
import api from "../../lib/axios"
import "./Auth.css";

const Signup = () => {
  const navigate  = useNavigate();
  const [Fullname , SetFullname] = useState('');
  const [Email , SetEmail] = useState('');
  const [Password , SetPassword] = useState('');
  const [ComfirmPass , SetComfirmPass] = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [success, setSuccess]     = useState("");



  const handleRegister = async(e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if(Password !== ComfirmPass){
      setError('Mật khẩu không trùng khớp');
      return;
    };

    try {
      setLoading(true);
      const newUser = {
        name: Fullname, 
        email: Email, 
        password: Password
      };

      const { data } = await api.post("/auth/registerAdmin" , newUser);
      setSuccess(data?.message || "Đăng ký thành công!");

      SetFullname("");
      SetEmail("");
      SetPassword("");
      SetComfirmPass("");

      await new Promise((r) => setTimeout(r, 8000));
      navigate("/", { replace: true });

    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || "Có lỗi xảy ra";
      setError(msg);
      
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className="signup-container">
      {/* Left Side - Form */}
      <div className="signup-left">
       
        <h2 className="signup-title">Sign Up</h2>
        <p className="signup-subtitle">Create your account to get started!</p>

        <form className="signup-form" onSubmit={handleRegister}>
          <label>Full Name *</label>
          <input 
            type="text" 
            placeholder="Full name" 
            required 
            onChange={(e) => SetFullname(e.target.value)}

          />

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

          <label>Confirm Password *</label>
          <input 
            type="password" 
            placeholder="Re-enter your password" 
            required 
            onChange={(e) => SetComfirmPass(e.target.value)}

          />
          {error && <p className="success">{error}</p>}
          {success && <p className="error">{success}</p>}
          

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? <span className="spinner" /> : "Sign Up"}
          </button>
        </form>

        <p className="login-text">
          Already have an account? <Link to="/">Sign In</Link>
        </p>
      </div>

    

      {/* Right Side - Banner */}
      <div className="signup-right">
       <div className="logo">
          <img src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757224196/Untitled-1_nru9av.png" alt="" />
        </div>
        <img className="image_banner" src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757577577/background_1_lsoh5u.webp" alt="Banner" />
     
      </div>
    </div>
  );
};

export default Signup;
