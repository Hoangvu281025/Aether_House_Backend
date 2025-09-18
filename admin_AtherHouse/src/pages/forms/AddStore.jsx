import React, { useState } from "react";
import "./Form.css";

export default function AddStore() {
  const [formData, setFormData] = useState({
    name: "",
    images: null,
    city: "",
    district: "",
    description: "",
  });
  
  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <div className="page-content">
      <h2 className="form-title">Add New Stores</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Cột 1 */}
          <div className="form-column">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Store name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>District</label>
              <input
                type="text"
                name="district"
                placeholder="District"
                value={formData.district}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="form-column">
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Store description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

           

          </div>
        </div>

        {/* Upload hình */}
        <div className="end">
          <div className="form-group upload">
            <label>
              Upload file images
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon-upload"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                width="40"
                height="40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-4 4m4-4l4 4"
                />
              </svg>
              <span>
                Click to upload or drag and drop SVG, PNG, JPG or GIF (MAX.
                800x400px)
              </span>
              <input type="file" name="images" onChange={handleChange} />
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Save Store
        </button>
      </form>
    </div>
  );
}
