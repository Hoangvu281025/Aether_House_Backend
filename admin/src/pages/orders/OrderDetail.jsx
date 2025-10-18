import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetail.css";
import api from "../../lib/axios";

// $ format (en-US)
const fmtUSD = (n) => "$ " + Number(n || 0).toLocaleString("en-US");

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [address, setAddress] = useState(null);
  const [voucher, setVoucher] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        const o = data?.order ?? null;
        const details = Array.isArray(data?.orderDetails) ? data.orderDetails : [];
        setOrder(o);
        setOrderDetails(details);
        setAddress(data?.address ?? o?.address_id ?? null);
        setVoucher(data?.voucher ?? o?.voucher_id ?? null);
      } catch (err) {
        console.error(err);
        setOrder(null);
        setOrderDetails([]);
        setAddress(null);
        setVoucher(null);
      }
    })();
  }, [id]);

  const statusClass = (s = "") =>
    ({
      pending: "ordd-badge ordd-badge-pending",
      prepare: "ordd-badge ordd-badge-prepare",
      shipping: "ordd-badge ordd-badge-shipping",
      completed: "ordd-badge ordd-badge-completed",
      canceled: "ordd-badge ordd-badge-canceled",
    }[s] || "ordd-badge");

  const subtotal = orderDetails.reduce(
    (sum, d) => sum + Number(d?.price ?? 0) * Number(d?.quantity ?? 0),
    0
  );

  // Giả định total_amount là số phải trả sau giảm.
  const payable = Number(order?.total_amount ?? 0);
  const discount = Math.max(0, subtotal - payable);

  if (!order) {
    return (
      <div className="ordd-page">
        <div className="ordd-header">
          <button className="ordd-btn ordd-btn-light" onClick={() => navigate("/orders")}>
            ← Quay lại
          </button>
          <h1 className="ordd-title">Order Detail</h1>
        </div>
        <div className="ordd-card">Đang tải…</div>
      </div>
    );
  }

  return (
    <div className="ordd-page">
      <div className="ordd-header">
        <button className="ordd-btn ordd-btn-light" onClick={() => navigate("/orders")}>
          ← Quay lại
        </button>
        <h1 className="ordd-title">Order Detail</h1>
      </div>

      <div className="ordd-grid-2">
        {/* Card: Thông tin đơn hàng */}
        <div className="ordd-card">
          <h3 className="ordd-card-title">Thông tin đơn hàng</h3>

          <div className="ordd-kv">
            <span>ID</span>
            <span className="ordd-mono">{order?._id}</span>
          </div>

          <div className="ordd-kv">
            <span>Status</span>
            <span className={statusClass(order?.status)}>{order?.status}</span>
          </div>

          <div className="ordd-kv">
            <span>Created</span>
            <span>
              {order?.createdAt ? new Date(order.createdAt).toLocaleString("en-US") : ""}
            </span>
          </div>

          {/* Address */}
          <div className="ordd-subtitle">Địa chỉ giao hàng</div>
          {address ? (
            <div className="ordd-address">
              <div><b>{address?.name}</b> {address?.phone ? `• ${address.phone}` : ""}</div>
              <div>{address?.address}</div>
              <div>
                {[address?.ward, address?.city, address?.country].filter(Boolean).join(", ")}
              </div>
              {address?._id && (
                <div className="ordd-fine">ID: <span className="ordd-mono">{address._id}</span></div>
              )}
            </div>
          ) : (
            <div className="ordd-fine">Không có địa chỉ</div>
          )}

          {/* Voucher */}
          <div className="ordd-subtitle">Voucher</div>
          {voucher ? (
            <div className="ordd-voucher">
              <div>
                <b className="ordd-mono">{voucher?.voucher_code || voucher?._id}</b>
                {typeof voucher?.value === "number" && (
                  <> — giảm {fmtUSD(voucher.value)}</>
                )}
              </div>
              {voucher?.description && <div className="ordd-fine">{voucher.description}</div>}
            </div>
          ) : (
            <div className="ordd-fine">—</div>
          )}

          {/* Tổng tiền */}
          <div className="ordd-totals">
            <div className="ordd-kv">
              <span>Subtotal</span>
              <span>{fmtUSD(subtotal)}</span>
            </div>
            <div className="ordd-kv">
              <span>Discount</span>
              <span>- {fmtUSD(discount)}</span>
            </div>
            <div className="ordd-kv ordd-kv-strong">
              <span>Phải trả</span>
              <span>{fmtUSD(payable)}</span>
            </div>
          </div>
        </div>

        {/* Card: Sản phẩm */}
        <div className="ordd-card">
          <h3 className="ordd-card-title">Sản phẩm</h3>
          <table className="ordd-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th className="ordd-right">Qty</th>
                <th className="ordd-right">Price</th>
                <th className="ordd-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((i) => {
                const variantName =
                  i?.variant_info?.name ||
                  i?.productvariant_id?.color ||
                  "—";
                const lineTotal = Number(i?.price ?? 0) * Number(i?.quantity ?? 0);
                return (
                  <tr key={i._id}>
                    <td className="ordd-mono">
                      {i?.product_id?.name ?? i?.product_id ?? ""}
                    </td>
                    <td className="ordd-mono">
                      {variantName}
                    </td>
                    <td className="ordd-right">{i?.quantity}</td>
                    <td className="ordd-right">
                      {Number(i?.price ?? 0).toLocaleString("en-US")}
                    </td>
                    <td className="ordd-right">
                      {lineTotal.toLocaleString("en-US")}
                    </td>
                  </tr>
                );
              })}
              {orderDetails.length === 0 && (
                <tr>
                  <td colSpan={5} className="ordd-empty">Không có sản phẩm</td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} className="ordd-right"><b>Subtotal</b></td>
                <td className="ordd-right"><b>{subtotal.toLocaleString("en-US")}</b></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
