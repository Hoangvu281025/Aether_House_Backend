import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import "./Voucher.css";
import Spinner from "../../components/spinner/spinner";

export default function Vouchers() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingId, setEditingId] = useState(null);

  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // form states
  const [value, setValue] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [quantity, setQuantity] = useState("");
  const [minTotal, setMinTotal] = useState("");
  const [maxTotal, setMaxTotal] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // ===== API =====
  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/vouchers/"); // BE trả mảng
      setVouchers(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  // ===== Modal control =====
  const openConfirm = (mode, id = null) => {
    setModalMode(mode);
    setEditingId(id);
    if (mode === "update" && id) {
      const current = vouchers.find((v) => v._id === id);
      if (current) {
        setValue(current.value || "");
        setVoucherCode(current.voucher_code || "");
        setQuantity(current.quantity || "");
        setMinTotal(current.min_total || "");
        setMaxTotal(current.max_total || "");
        setDescription(current.description || "");
        setIsActive(current.isActive);
      }
    } else {
      resetForm();
    }
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    resetForm();
    setConfirmOpen(false);
    setEditingId(null);
  };

  const resetForm = () => {
    setValue("");
    setVoucherCode("");
    setQuantity("");
    setMinTotal("");
    setMaxTotal("");
    setDescription("");
    setIsActive(true);
  };

  // ===== Submit form =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      value,
      voucher_code: voucherCode,
      quantity,
      min_total: minTotal,
      max_total: maxTotal,
      description,
      isActive,
    };

    try {
      setLoading(true);
      if (modalMode === "update" && editingId) {
        const { data } = await api.put(`/vouchers/${editingId}`, payload);
        setVouchers((prev) =>
          prev.map((v) => (v._id === editingId ? data.voucher : v))
        );
        alert("Cập nhật voucher thành công!");
      } else {
        const { data } = await api.post("/vouchers", payload);
        setVouchers((prev) => [data.voucher, ...prev]);
        alert("Thêm voucher thành công!");
      }
      closeConfirm();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert("Lưu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // ===== Delete =====
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa voucher này?")) return;
    try {
      await api.delete(`/vouchers/${id}`);
      setVouchers((prev) => prev.filter((v) => v._id !== id));
      alert("Xóa voucher thành công!");
    } catch (e) {
      console.error(e);
      alert("Xóa voucher thất bại!");
    }
  };

  // ===== Toggle Active =====
  const handleToggleActive = async (id, currentStatus) => {
    try {
      const { data } = await api.put(`/vouchers/${id}`, { isActive: !currentStatus });
      setVouchers((prev) =>
        prev.map((v) => (v._id === id ? data.voucher : v))
      );
      alert(currentStatus ? "Đã vô hiệu hóa voucher" : "Đã kích hoạt voucher");
    } catch (e) {
      console.error(e);
      alert("Thao tác thất bại!");
    }
  };

  const filteredVouchers = vouchers.filter((v) =>
    v.voucher_code.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="vouchers-container">
      <div className="vouchers-header">
        <h2>Vouchers List</h2>
        <p>Manage your discount codes and promotions.</p>
      </div>

      <div className="vouchers-actions">
        <input
          type="text"
          placeholder="Search voucher code..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="btn-group">
          <button className="btn export">Export ⬇</button>
          <button className="btn add" onClick={() => openConfirm("add")}>
            + Add Voucher
          </button>
        </div>
      </div>

      <table className="vouchers-table">
        <thead>
          <tr>
            <th>Code</th>
            <th>Value (%)</th>
            <th>Quantity</th>
            <th>Min Total</th>
            <th>Max Total</th>
            <th>Description</th>
            <th>Status</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredVouchers.map((item) => (
            <tr key={item._id}>
              <td>{item.voucher_code}</td>
              <td>{item.value}</td>
              <td>{item.quantity}</td>
              <td>{item.min_total}</td>
              <td>{item.max_total}</td>
              <td>{item.description}</td>
              <td>
                <span
                  className={`stock-badge ${
                    item.isActive ? "in-stock" : "inactive"
                  }`}
                >
                  {item.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td>{new Date(item.createdAt).toLocaleDateString()}</td>
              <td>
                <div className="button_wrapper">
                  <button
                    className="btn1 btn"
                    onClick={() => openConfirm("update", item._id)}
                  >
                    Update
                  </button>
                  <button
                    className="btn3 btn"
                    onClick={() => handleToggleActive(item._id, item.isActive)}
                  >
                    {item.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="btn2 btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Voucher Add/Update Modal */}
      {confirmOpen && (
        <div className="pop-up-store" onClick={closeConfirm}>
          <div
            className="pop-up-content-form"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="form-title">
              {modalMode === "update" ? "Update Voucher" : "Add New Voucher"}
            </h2>

            <form className="voucher-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Voucher Code</label>
                  <input
                    value={voucherCode}
                    onChange={(e) => setVoucherCode(e.target.value)}
                    placeholder="Voucher code"
                  />
                </div>
                <div className="form-group">
                  <label>Value (%)</label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Discount percent"
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Usage limit"
                  />
                </div>
                <div className="form-group">
                  <label>Min Total</label>
                  <input
                    type="number"
                    value={minTotal}
                    onChange={(e) => setMinTotal(e.target.value)}
                    placeholder="Min total"
                  />
                </div>
                <div className="form-group">
                  <label>Max Total</label>
                  <input
                    type="number"
                    value={maxTotal}
                    onChange={(e) => setMaxTotal(e.target.value)}
                    placeholder="Max total"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Voucher description"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={isActive ? "true" : "false"}
                    onChange={(e) => setIsActive(e.target.value === "true")}
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="btn-row">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <Spinner />
                  ) : modalMode === "update" ? (
                    "Save Changes"
                  ) : (
                    "Save Voucher"
                  )}
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeConfirm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
