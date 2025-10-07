import { Link } from "react-router-dom";
import "./Stores.css";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../../lib/axios"

const Stores = () => {
  const [Stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/stores'); 
        setStores(data.stores)
      } catch (err) {
        console.error("Lỗi khi lấy Stores:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  },[])

  if (loading) return <p>Đang tải danh sách cửa hàng...</p>;
        console.log(Stores);

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Stores List</h2>
        <p>Track your store's progress to boost your sales.</p>
      </div>

      <div className="products-actions">
        <input type="text" placeholder="Search..." className="search-input" />
        <div className="btn-group">
          <button className="btn export">Export ⬇</button>
           <Link
              to="/forms/add-product"
              style={{
                color: "white",
                textDecoration: "none",
                display: "block",
              }}
            >
          <button className="btn add">
              + Add Stores
          </button>
            </Link>
        </div>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {Stores.map((stores) => (
            <tr key={stores._id}>
              <td className="product-info">
                <img src={stores.images.url} alt={stores.name} className="product-img" />
                <span>{stores.name}</span>
              </td>
              <td>{stores.city}</td>
              <td>{dayjs(stores.createdAt).format("DD/MM/YYYY HH:mm")}</td>
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

export default Stores;
