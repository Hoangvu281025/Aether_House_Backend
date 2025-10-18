import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import "../users/Users.css";
import Success from "../../components/Success/Success";

const CategoryForm = ({ onClose, refreshList, editingCate }) => {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState(null);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // 🌀 Lấy danh sách Category cha
  useEffect(() => {
    const fetchParentCates = async () => {
      try {
        const { data } = await api.get("/categories/catefa");
        setParents(data?.categories || []);
      } catch (err) {
        console.error("Lỗi lấy category cha:", err);
      }
    };
    fetchParentCates();
  }, []);

  // 🌀 Khi mở form sửa → tự điền dữ liệu
  useEffect(() => {
    if (editingCate) {
      setName(editingCate.name || "");
      setParentId(editingCate.parentId || null);
    } else {
      setName("");
      setParentId(null);
    }
  }, [editingCate]);

  // 🌀 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Vui lòng nhập tên danh mục");
    setLoading(true);

    try {
      let res;
      if (editingCate) {
        res = await api.put(`/categories/${editingCate._id}`, {
          name,
          parentId: parentId || null,
        });
        if (res.data.success) setSuccessMsg("Cập nhật Category thành công!");
      } else {
        res = await api.post("/categories/", {
          name,
          parentId: parentId || null,
        });
        if (res.data.success) setSuccessMsg("Thêm Category thành công!");
      }

      if (res.data.success) {
        refreshList();
        // Sau 1.5s tự đóng popup và tắt success
        setTimeout(() => {
          setSuccessMsg("");
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Lỗi khi thêm / cập nhật category:", err);
      alert(err.response?.data?.error || "Đã xảy ra lỗi, vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pop-up">
      <div className="pop-up-content">
        <div className="pop-up-content-header">
          <h2>{editingCate ? "Cập nhật Category" : "Thêm Category mới"}</h2>
          <p>
            {editingCate
              ? "Chỉnh sửa thông tin danh mục"
              : "Nhập thông tin danh mục bên dưới"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tên danh mục */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Tên danh mục</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên danh mục..."
              className="input"
              required
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#1e2a3a",
                color: "#fff",
              }}
            />
          </div>

          {/* Danh mục cha */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Danh mục cha</label>
            <select
              value={parentId || ""}
              onChange={(e) =>
                setParentId(e.target.value === "" ? null : e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                background: "#1e2a3a",
                color: "#fff",
              }}
            >
              <option value="">null</option>
              {parents.map((cate) => (
                <option key={cate._id} value={cate._id}>
                  {cate.name}
                </option>
              ))}
            </select>
          </div>

          {/* Nút hành động */}
          <div className="pop-up-content-actions">
            <button
              type="button"
              className="btn cancel"
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>

            <button type="submit" className="btn confirm" disabled={loading}>
              {loading
                ? "Đang lưu..."
                : editingCate
                ? "Cập nhật Category"
                : "Thêm Category"}
            </button>
          </div>
        </form>
      </div>

      {/* ✅ Hiển thị popup thành công */}
      {successMsg && (
        <Success message={successMsg} onClose={() => setSuccessMsg("")} />
      )}
    </div>
  );
};

export default CategoryForm;
