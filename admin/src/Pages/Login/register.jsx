import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const AdminRegister = () => {
  const nav = useNavigate();
  const [Form , setForm] = useState({name:'' , email:'' , password:'' , confirm:''});
  const [Err , setErr] = useState("");
  const [Success , setSuccess] = useState("");
  const [Loading , setLoading] = useState(false);

  const mismatch  = Form.confirm && Form.password !== Form.confirm;

  const disabled =  mismatch ;

  const onchange = (e) => {
    const {name , value} = e.target;
    setForm((f)  => ({...f, [name]: value}));
    setErr(""), setSuccess("");
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(""); setSuccess("");
    if (mismatch) return setErr("Confirm password không khớp.");
    try {
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3000/api/users/registerAdmin",
        { name: Form.name.trim(), email: Form.email.trim(), password: Form.password }
      );
      setSuccess(data?.message || "Đăng ký thành công!");
      setTimeout(() => nav("/"), 3000); 
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        "Đăng ký thất bại. Thử lại.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };
  return (

    
    <div className="signup-container">
      <div className="signup-container">
      <div className="signup-box">
        {/* Logo */}
        <img className="logo" src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757224196/Untitled-1_nru9av.png" alt="" />

        {/* Tiêu đề */}
        <h2 className="title">Sign up</h2>
        
        {/* Form */}
        <form onSubmit={onSubmit}  className="form">
          <div className="input_label">
            <input
              className="input_admin"
              type="text"
              name="name"
              value={Form.name}
              onChange={onchange}
              placeholder="Fullname"
              required
            />

          </div>
          <div className="input_label">
            <input
              className="input_admin"
              type="email"
              name="email"
              value={Form.email}
              onChange={onchange}
              placeholder="Email"
              required
            />

          </div>
          <div className="input_label">
            <input
              className="input_admin"
              type="password"
              name="password"
              value={Form.password}
              onChange={onchange}
              placeholder="Password"
              required
            />
          </div>
          <div className="input_label">
            <input
              className="input_admin"
              type="password"
              name="confirm"
              placeholder="Confirm Password"
              value={Form.confirm}
              onChange={onchange}
              required
            />
          </div>
          <button
            type="submit"
            className={`btn_login_admin ${!disabled ? "active_color_btn" : ""} ${Loading ? "is-loading" : ""}`}
            disabled={disabled}
          >
            {Loading ? "" : "Sign up"}
          </button>

        </form>

        {/* Thông báo */}
        {Err && <p style={{ color: "#b00020", marginBottom: 8 }}>{Err}</p>}

        {Success && <p style={{ color: "#0a7c2f", marginBottom: 8 }}>{Success}</p>}
        
        {mismatch && !Err && (
          <p style={{ color: "#b00020", marginBottom: 8 }}>Confirm password không khớp.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminRegister;
