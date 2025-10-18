import React from "react";
import "./Success.css";

export default function Success({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="success-overlay" onClick={onClose}>
      <div className="success-box" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">✔</div>
        <p className="success-message">{message}</p>
        <button className="success-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
