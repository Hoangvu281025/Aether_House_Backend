import React, { useState } from "react";
import api from "../../lib/axios";
import "./Form.css";

export default function AddStore() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [information, setInformation] = useState("");

  const [image, setImage] = useState(null); // chỉ 1 ảnh

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", name);
      formDataToSend.append("city", city);
      formDataToSend.append("information", information);
      formDataToSend.append("description", description);

      if (image) {
        formDataToSend.append("image", image); // key "image"
      }

      const res = await api.post("/stores", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Upload thành công:", res.data);
      alert("Thêm store thành công!");

      // Reset form
      setName("");
      setCity("");

      setDescription("");
      setImage(null);
    } catch (err) {
      console.error("Lỗi khi upload:", err);
      alert("Upload thất bại!");
    }
  };

  return (
    <div className="page-content">
      <h2 className="form-title">Add New Store</h2>
      <form className="product-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Cột 1 */}
          <div className="form-column">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                placeholder="Store name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Cột 2 */}
          <div className="form-column">
            <div className="form-group">
              <label>Information</label>
              <input
                type="text"
                placeholder="Information"
                value={information}
                onChange={(e) => setInformation(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Store description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Upload hình */}
        <div className="end">
          <div className="form-group upload">
            <label>
              Upload image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </label>
            {image && (
              <p style={{ marginTop: "10px" }}>
                File đã chọn: <strong>{image.name}</strong>
              </p>
            )}
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Save Store
        </button>
      </form>
    </div>
  );
}
