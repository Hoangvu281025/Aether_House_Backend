import "./Stores.css";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import api from "../../lib/axios";

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'update'
  const [editingId, setEditingId] = useState(null);

  // form states (controlled)
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [information, setInformation] = useState("");
  const [image, setImage] = useState(null);

  const resetForm = () => {
    setName("");
    setCity("");
    setPhone("");
    setEmail("");
    setAddress("");
    setDescription("");
    setInformation("");
    setImage(null);
  };

  const openConfirm = (mode, id = null) => {
    setModalMode(mode);
    setEditingId(id);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setEditingId(null);
    // tuỳ chọn: reset khi đóng
    // resetForm();
  };

  // Fetch list
  const fetchStores = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/stores");
      setStores(data.stores || []);
    } catch (err) {
      console.error("Lỗi khi lấy Stores:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Prefill khi mở modal update
  useEffect(() => {
    if (!confirmOpen || modalMode !== "update" || !editingId) return;
    const current = stores.find((s) => s._id === editingId);
    if (current) {
      setName(current.name || "");
      setCity(current.city || "");
      setPhone(current.phone || "");
      setEmail(current.email || "");
      setAddress(current.address || "");
      setDescription(current.description || "");
      setInformation(current.information || "");
      setImage(null); // chỉ set khi user chọn file mới
    } else {
      // nếu list chưa có đủ detail, có thể gọi API detail ở đây
      // (async () => {
      //   const { data } = await api.get(`/stores/${editingId}`);
      //   // set... theo data
      // })();
    }
  }, [confirmOpen, modalMode, editingId, stores]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("city", city);
      fd.append("phone", phone);
      fd.append("address", address);
      fd.append("email", email);
      fd.append("information", information);
      fd.append("description", description);
      if (image) fd.append("image", image); // chỉ gửi khi có file mới

      if (modalMode === "update" && editingId) {
        // UPDATE
        const { data } = await api.put(`/stores/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // cập nhật list tại chỗ (nếu API trả store mới)
        if (data?.store) {
          setStores((prev) =>
            prev.map((s) => (s._id === editingId ? data.store : s))
          );
        } else {
          // fallback: refetch
          await fetchStores();
        }
        alert("Cập nhật cửa hàng thành công!");
      } else {
        // ADD
        const { data } = await api.post("/stores", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data?.store) {
          setStores((prev) => [data.store, ...prev]);
        } else {
          await fetchStores();
        }
        alert("Thêm cửa hàng thành công!");
      }

      resetForm();
      closeConfirm();
    } catch (err) {
      console.error("Lỗi khi lưu:", err?.response?.data || err.message);
      alert("Lưu thất bại!");
    }
  };

  if (loading) return <p>Đang tải danh sách cửa hàng...</p>;

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Stores List</h2>
        <p>Track your store's progress to boost your sales.</p>
      </div>

      <div className="products-actions">
        <input type="text" placeholder="Search..." className="search-input" />
        <div className="btn-group">
          {/* phải truyền 'add' */}
          <button className="btn add" onClick={() => openConfirm("add")}>
            + Add Stores
          </button>
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
          {stores.map((store) => (
            <tr key={store._id}>
              <td className="product-info">
                <img
                  src={store.images?.url}
                  alt={store.name}
                  className="product-img"
                />
                <span>{store.name}</span>
              </td>
              <td>{store.city}</td>
              <td>{dayjs(store.createdAt).format("DD/MM/YYYY HH:mm")}</td>
              <td>
                <div className="button_wrapper">
                  <button
                    className="btn1 btn"
                    onClick={() => openConfirm("update", store._id)}
                  >
                    Update
                  </button>
                  {/* <button
                    className="btn2 btn"
                    onClick={() => {
                      if (confirm("Delete this store?")) deleteStore(store._id);
                    }}
                  >
                    Delete
                  </button> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal ADD / UPDATE dùng chung form controlled */}
      {confirmOpen && (
        <div className="pop-up-store" onClick={closeConfirm}>
          <div
            className="pop-up-content-form"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="form-title">
              {modalMode === "update" ? "Update Store" : "Add New Store"}
            </h2>

            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-column">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      placeholder="Store name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      placeholder="Phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-group">
                    <label>Information</label>
                    <input
                      type="text"
                      placeholder="Information"
                      value={information}
                      onChange={(e) => setInformation(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Store description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Images</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                    />
                  </div>
                </div>
              </div>

              <div className="btn-row">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeConfirm}
                >
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  {modalMode === "update" ? "Save Changes" : "Save Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
