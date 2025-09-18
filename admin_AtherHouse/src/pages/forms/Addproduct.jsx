import React, { useState } from "react";
import "./Form.css";

export default function AddProduct() {
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
            <h2 className="form-title">Add New Product</h2>
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


                <div className="end">
  <div className="form-group upload">
    <label> UpLoad file imgaes
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon-upload"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="40"
        height="40"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 12V4m0 0l-4 4m4-4l4 4" />
      </svg>
      <span>Click to upload or drag and drop SVG, PNG, JPG or GIF (MAX. 800x400px)</span>
      <input type="file" name="images" onChange={handleChange} />
    </label>
  </div>
</div>
                <button type="submit" className="submit-btn">
                    Save Product
                </button>
            </form>

        </div>
    );
}
