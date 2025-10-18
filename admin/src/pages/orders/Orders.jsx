import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Order.css";
import api from "../../lib/axios";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingId, setLoadingId] = useState(null); // id của order đang cập nhật

  const getOrders = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách đơn hàng:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const statusClass = (s) =>
    ({
      pending: "ord-badge ord-badge-pending",
      prepare: "ord-badge ord-badge-prepare",
      shipping: "ord-badge ord-badge-shipping",
      completed: "ord-badge ord-badge-completed",
      canceled: "ord-badge ord-badge-canceled",
    }[s] || "ord-badge");

  const statusOptions = ["pending", "prepare", "shipping", "completed", "canceled"];

  // 🌀 Hàm gọi API cập nhật trạng thái
  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingId(orderId);
    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      if (res.data?.order) {
        // Cập nhật trong state
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: res.data.order.status } : o
          )
        );
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái. Vui lòng thử lại!");
    } finally {
      setLoadingId(null);
    }
  };

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
                <td>$ {Number(o.total_amount).toLocaleString("en-US")}</td>
                <td>
                  <span className={statusClass(o.status)}>{o.status}</span>
                </td>
                <td>{new Date(o.createdAt).toLocaleString("vi-VN")}</td>
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
                    disabled={loadingId === o._id}
                    onChange={(e) => handleStatusChange(o._id, e.target.value)}
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
