import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Form.css";

export default function FormProductUpdate() {
  const { id } = useParams(); // Lấy id từ URL
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    images: null,
    description: "",
    create_at: "",
    updated_at: "",
    quantity: 0,
    category: "",
  });

  useEffect(() => {
    // Giả lập fetch data từ API theo id
    console.log("Product ID to update:", id);

    // Ví dụ giả lập data cũ
    const productFromAPI = {
      name: "ASUS ROG Gaming Laptop",
      slug: "asus-rog",
      price: "2199",
      description: "High-end gaming laptop",
      create_at: "2027-12-01",
      updated_at: "2027-12-10",
      quantity: 5,
      category: "Laptop",
    };
    setFormData(productFromAPI);
  }, [id]);

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
    console.log("Update Product Data for ID", id, ":", formData);
    // Gọi API update ở đây
  };

  return (
    <div className="page-content">
      <h2 className="form-title">Update Product</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Cột 1 */}
          <div className="form-column">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Slug</label>
              <input
                type="text"
                name="slug"
                placeholder="product-slug"
                value={formData.slug}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Product description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="form-column">
            <div className="form-group">
              <label>Create At</label>
              <input
                type="date"
                name="create_at"
                value={formData.create_at}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Updated At</label>
              <input
                type="date"
                name="updated_at"
                value={formData.updated_at}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Upload file */}
        <div className="end">
          <div className="form-group upload">
            <label>
              Upload file images
              <span>
                {formData.images
                  ? formData.images.name
                  : "Click to upload or drag and drop SVG, PNG, JPG or GIF (MAX. 800x400px)"}
              </span>
              <input type="file" name="images" onChange={handleChange} />
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Update Product
        </button>
      </form>
    </div>
  );
}
