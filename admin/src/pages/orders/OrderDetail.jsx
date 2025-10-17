import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Order.css";
import api from "../../lib/axios";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);       // object
  const [orderDetails, setOrderDetails] = useState([]); // array

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data?.order ?? null);
        setOrderDetails(Array.isArray(data?.orderDetails) ? data.orderDetails : []);
      } catch (err) {
        console.error(err);
        setOrder(null);
        setOrderDetails([]);
      }
    })();
  }, [id]);

  const statusClass = (s = "") =>
    ({
      pending: "badge badge-pending",
      prepare: "badge badge-prepare",
      shipping: "badge badge-shipping",
      completed: "badge badge-completed",
      canceled: "badge badge-canceled",
    }[s] || "badge");

  const subtotal = orderDetails.reduce(
    (sum, d) => sum + Number(d?.price ?? 0) * Number(d?.quantity ?? 0),
    0
  );

  if (!order) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-light" onClick={() => navigate("/orders")}>
            ← Quay lại
          </button>
          <h1 className="page-title">Order Detail</h1>
        </div>
        <div className="card">Đang tải…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-light" onClick={() => navigate("/orders")}>
          ← Quay lại
        </button>
        <h1 className="page-title">Order Detail</h1>
      </div>

      <div className="grid-2">
        <div className="card">
          <h3 className="card-title">Thông tin đơn hàng</h3>

          <div className="kv">
            <span>ID</span>
            <span className="mono">{order?._id}</span>
          </div>

          <div className="kv">
            <span>Status</span>
            <span className={statusClass(order?.status)}>{order?.status}</span>
          </div>

          <div className="kv">
            <span>Total</span>
            <span>{Number(order?.total_amount ?? 0).toLocaleString("vi-VN")} đ</span>
          </div>

          <div className="kv">
            <span>Created</span>
            <span>{order?.createdAt ? new Date(order.createdAt).toLocaleString("vi-VN") : ""}</span>
          </div>

          <div className="kv">
            <span>Address</span>
            {/* address_id đã populate → object */}
            <span className="mono">
              {order?.address_id?._id ?? order?.address_id}
            </span>
          </div>

          <div className="kv">
            <span>Voucher</span>
            <span className="mono">
              {order?.voucher_id?._id ?? order?.voucher_id ?? "—"}
            </span>
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Sản phẩm</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th className="right">Qty</th>
                <th className="right">Price</th>
                <th className="right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((i) => (
                <tr key={i._id}>
                  {/* product_id đã populate → object có name */}
                  <td className="mono">
                    {i?.product_id?.name ?? i?.product_id ?? ""}
                  </td>
                  <td className="mono">
                    {/* bạn không populate productvariant_id → có thể là ID hoặc subdoc */}
                    {i?.productvariant_id?.color ?? i?.productvariant_id ?? "—"}
                  </td>
                  <td className="right">{i?.quantity}</td>
                  <td className="right">
                    {Number(i?.price ?? 0).toLocaleString("vi-VN")}
                  </td>
                  <td className="right">
                    {(Number(i?.price ?? 0) * Number(i?.quantity ?? 0)).toLocaleString("vi-VN")}
                  </td>
                </tr>
              ))}
              {orderDetails.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty">Không có sản phẩm</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="right"><b>Subtotal</b></td>
                <td className="right"><b>{subtotal.toLocaleString("vi-VN")}</b></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

