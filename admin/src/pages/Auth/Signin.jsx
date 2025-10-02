import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/axios"
import {Link} from "react-router-dom";

import Spinner from "../../components/spinner/spinner"
import "./Auth.css";

const Signin = () => {
    const navigate  = useNavigate();
    const [Email , SetEmail] = useState('');
    const [loading , SetLoading] = useState(false);

    

    const handleSubmit = async(e) =>{
      e.preventDefault()
     
      try {
        SetLoading(true);
        await api.post("/auth/login-admin" , {email: Email});

        navigate("/Verify", { replace: true, state: { Email } });

      } catch (err) {
        console.log(err)
      }finally{
        SetLoading(false);
      }
    }
  return (
    <div className="signup-container">
      {/* Left Form */}
      <div className="signup-left">
        <h2 className="signup-title">Sign In</h2>
        <p className="signup-subtitle">Create your account to get started!</p>

      
        <form className="signup-form" onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="info@gmail.com" 
            required 
            onChange={(e) => SetEmail(e.target.value)}
          />

         

        
          <button type="submit" className="signup-btn" >
            {loading ? <Spinner/> : "Sign in"}
          </button>
        </form>
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
