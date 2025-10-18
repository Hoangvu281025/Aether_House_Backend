import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Order.css";
import api from "../../lib/axios";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  console.log(orders);

  const getorder = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getorder();
  }, []);

  const statusClass = (s) =>
    ({
      pending: "ord-badge ord-badge-pending",
      prepare: "ord-badge ord-badge-prepare",
      shipping: "ord-badge ord-badge-shipping",
      completed: "ord-badge ord-badge-completed",
      canceled: "ord-badge ord-badge-canceled",
    }[s] || "ord-badge");

  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
    );
  };

  const statusOptions = ["pending", "prepare", "shipping", "completed", "canceled"];

  return (
    <div className="ord-page">
      <div className="ord-header">
        <h1 className="ord-title">Orders</h1>
      </div>

      <div className="ord-card">
        <table className="ord-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created At</th>
              <th className="ord-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>{o._id}</td>
                <td>{o.total_amount.toLocaleString("vi-VN")}</td>
                <td>
                  <span className={statusClass(o.status)}>{o.status}</span>
                </td>
                <td>{new Date(o.createdAt).toLocaleString()}</td>
                <td className="ord-center ord-flex ord-gap-2">
                  <button
                    className="ord-btn ord-btn-view"
                    onClick={() => navigate(`/orders/${o._id}`)}
                  >
                    Xem chi tiết
                  </button>

                  <select
                    className="ord-select-status"
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    {statusOptions.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="ord-empty">
                  Chưa có đơn hàng
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
