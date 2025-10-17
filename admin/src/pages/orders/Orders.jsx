import React, {  useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Order.css";
import api from "../../lib/axios";

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  console.log(orders)
  const getorder = async () => {
    try {
      const { data } = await api.get("/orders");
      setOrders(data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getorder()
  },[])

  const statusClass = (s) =>
    ({
      pending: "badge badge-pending",
      prepare: "badge badge-prepare",
      shipping: "badge badge-shipping",
      completed: "badge badge-completed",
      canceled: "badge badge-canceled",
    }[s] || "badge");

  // fake update trạng thái (sau này sẽ gọi API PATCH)
  const updateStatus = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === id ? { ...o, status: newStatus } : o))
    );
  };

  const statusOptions = ["pending", "prepare", "shipping", "completed", "canceled"];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Orders</h1>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Created At</th>
              <th className="center">Action</th>
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
                <td className="center flex gap-2">
                  <button
                    className="btn btn-view"
                    onClick={() => navigate(`/orders/${o._id}`)}
                  >
                    Xem chi tiết
                  </button>

                  {/* Select để đổi trạng thái */}
                  <select
                    className="select-status"
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
                <td colSpan="5" className="empty">
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

