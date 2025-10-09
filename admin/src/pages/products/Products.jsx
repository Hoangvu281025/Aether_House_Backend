import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.products);

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
    


  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products List</h2>
        <p>Track your store's progress to boost your sales.</p>
      </div>

      <div className="products-actions">
        <input type="text" placeholder="Search..." className="search-input" />
        <div className="btn-group">
          <button className="btn export">Export ⬇</button>
           <Link
              to="/ecommerce/add-product"
              style={{
                color: "white",
                textDecoration: "none",
                display: "block",
              }}
            >
          <button className="btn add">
           
              + Add Product
          </button>
            </Link>

        </div>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Products</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => {
            const mainImage = item.images.find(img => img.is_main) || item.images[0];

            return (
              <tr key={item._id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="product-info">
                  <img 
                    src={mainImage?.url} 
                    alt={item.name} 
                    className="product-img" 
                  />
                  <span>{item.name}</span>
                </td>
                <td>{item.category_id.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>
                  <span
                    className={`stock-badge ${
                      item.stock === "In Stock" ? "in-stock" : "out-stock"
                    }`}
                  >
                    {item.stock}
                  </span>
                </td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="button_wrapper">
                    <button className="btn1 btn">Update</button>
                    <button className="btn2 btn">Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
};

export default Products;
