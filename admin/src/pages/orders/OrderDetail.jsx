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
  const [user, setUser] = useState(null);

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
        setUser(data?.user ?? o?.voucher_id ?? null);
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

  // Assume total_amount is the final payable after discount
  const payable = Number(order?.total_amount ?? 0);
  const discount = Math.max(0, subtotal - payable);

  if (!order) {
    return (
      <div className="ordd-page">
        <div className="ordd-header">
          <button className="ordd-btn ordd-btn-light" onClick={() => navigate("/orders")}>
            ← Back
          </button>
          <h1 className="ordd-title">Order Detail</h1>
        </div>
        <div className="ordd-card">Loading…</div>
      </div>
    );
  }

  return (
    <div className="ordd-page">
      <div className="ordd-header">
        <button className="ordd-btn ordd-btn-light" onClick={() => navigate("/orders")}>
          ← Back
        </button>
        <h1 className="ordd-title">Order Detail</h1>
      </div>

      <div className="ordd-grid-2">
        {/* Card: Order Info */}
        <div className="ordd-card">
          <h3 className="ordd-card-title">Order Information</h3>

          <div className="ordd-kv">
            <span>ID</span>
            <span className="ordd-mono">{order?._id}</span>
          </div>

          <div className="ordd-kv">
            <span>Status</span>
            <span className={statusClass(order?.status)}>{order?.status}</span>
          </div>
          <div className="ordd-kv">
            <span>Payment Method</span>
            <span className="ordd-mono">{order?.payment_method}</span>
          </div>

          <div className="ordd-kv">
            <span>Created</span>
            <span>
              {order?.createdAt ? new Date(order.createdAt).toLocaleString("en-US") : ""}
            </span>
          </div>

          {/* Address */}
          <div className="ordd-subtitle">Shipping Address</div>
          {address ? (
            <div className="ordd-address">
              <div className="ordd-address-row">
                <span className="ordd-label">Name:</span>{address?.name}
              </div>
              <div className="ordd-address-row">
                <span className="ordd-label">Email:</span>{user?.email}
              </div>
              <div className="ordd-address-row">
                <span className="ordd-label">Phone:</span>{address?.phone}
              </div>
              <div className="ordd-address-row">
                <span className="ordd-label">Address:</span>{address?.address}
              </div>
              <div className="ordd-address-row">
                <span className="ordd-label">Region:</span> {[address?.ward, address?.city, address?.country].filter(Boolean).join(", ")}
              </div>
              {address?._id && (
                <div className="ordd-fine">ID: <span className="ordd-mono">{address._id}</span></div>
              )}
            </div>
          ) : (
            <div className="ordd-fine">No address</div>
          )}

          {/* Voucher */}
          <div className="ordd-subtitle">Voucher</div>
          {voucher ? (
            <div className="ordd-voucher">
              <div className="ordd-address-row">
                <span className="ordd-label">Code:</span>
                <span className="ordd-mono">{voucher?.voucher_code || voucher?._id}</span>
              </div>
              {typeof voucher?.value === "number" && (
                <div className="ordd-address-row">
                  <span className="ordd-label">Discount:</span>
                  <span>{fmtUSD(voucher.value)}</span>
                </div>
              )}
              {voucher?.description && <div className="ordd-fine">{voucher.description}</div>}
            </div>
          ) : (
            <div className="ordd-fine">—</div>
          )}

          {/* Totals */}
          
        </div>

        {/* Card: Products */}
        <div className="ordd-card">
          <h3 className="ordd-card-title">Products</h3>
          <table className="ordd-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th className="ordd-right">Qty</th>
                <th className="ordd-right">Price</th>
                {/* <th className="ordd-right">Line Total</th> */}
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
                  <td colSpan={5} className="ordd-empty">No products</td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="ordd-totals">
            <div className="ordd-kv">
              <span>Total</span>
              <span>{fmtUSD(subtotal)}</span>
            </div>
            <div className="ordd-kv">
              <span>Discount</span>
              <span>- {fmtUSD(discount)}</span>
            </div>
            <div className="ordd-kv ordd-kv-strong">
              <span>Payable</span>
              <span>{fmtUSD(payable)}</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
