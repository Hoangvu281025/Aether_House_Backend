import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Products.css";

const Products = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const products = [
    {
      id: 1,
      name: "ASUS ROG Gaming Laptop",
      category: "Laptop",
      brand: "ASUS",
      price: "$2,199",
      stock: "Out of Stock",
      createdAt: "01 Dec, 2027",
      image: "https://via.placeholder.com/50x50?text=ASUS",
    },
    {
      id: 2,
      name: "Airpods Pro 2nd Gen",
      category: "Accessories",
      brand: "Apple",
      price: "$839",
      stock: "In Stock",
      createdAt: "29 Jun, 2027",
      image: "https://via.placeholder.com/50x50?text=Airpods",
    },
    {
      id: 3,
      name: "Apple Watch Ultra",
      category: "Watch",
      brand: "Apple",
      price: "$1,579",
      stock: "Out of Stock",
      createdAt: "13 Mar, 2027",
      image: "https://via.placeholder.com/50x50?text=Watch",
    },
    {
      id: 4,
      name: "Bose QuietComfort Earbuds",
      category: "Audio",
      brand: "Bose",
      price: "$279",
      stock: "In Stock",
      createdAt: "18 Nov, 2027",
      image: "https://via.placeholder.com/50x50?text=Bose",
    },
  ];

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

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
          <button className="btn add">
            <Link
              to="/ecommerce/add-product"
              style={{
                color: "white",
                textDecoration: "none",
                display: "block",
              }}
            >
              + Add Product
            </Link>
          </button>
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
            <th>Brand</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((item) => (
            <tr key={item.id}>
              <td>
                <input type="checkbox" />
              </td>
              <td className="product-info">
                <img src={item.image} alt={item.name} className="product-img" />
                <span>{item.name}</span>
              </td>
              <td>{item.category}</td>
              <td>{item.brand}</td>
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
              <td>{item.createdAt}</td>
              <td>
                <div className="button_wrapper">
                  <button className="btn1 btn">Update</button>
                  <button className="btn2 btn">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
