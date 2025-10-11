import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import "../users/Users.css"; // Dùng lại style của User

const CategoryForm = ({ onClose, refreshList, editingCate }) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [parentId, setParentId] = useState(null);
  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🌀 Lấy danh sách Category cha để đưa vào select
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

  // 🌀 Khi mở form để sửa → tự điền dữ liệu cũ
  useEffect(() => {
    if (editingCate) {
      setName(editingCate.name || "");
      setParentId(editingCate.parentId || null);
      // tạo slug từ tên cũ
      const slugValue = (editingCate.name || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
      setSlug(slugValue);
    } else {
      // reset nếu là form thêm mới
      setName("");
      setParentId(null);
      setSlug("");
    }
  }, [editingCate]);

  // 🌀 Khi user nhập tên → tự sinh slug
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setName(newName);
    const slugValue = newName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
    setSlug(slugValue);
  };

  // 🌀 Submit form (thêm hoặc cập nhật)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Vui lòng nhập tên danh mục");
    setLoading(true);

    try {
      if (editingCate) {
        // 🔁 CẬP NHẬT CATEGORY
        const res = await api.put(`/categories/${editingCate._id}`, {
          name,
          parentId: parentId || null,
        });

        if (res.data.success) {
          alert("Cập nhật Category thành công!");
          refreshList();
          onClose();
        }
      } else {
        // 🆕 THÊM MỚI CATEGORY
        const res = await api.post("/categories/", {
          name,
          parentId: parentId || null,
        });

        if (res.data.success) {
          alert("Thêm Category thành công!");
          refreshList();
          onClose();
        }
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
          <p>{editingCate ? "Chỉnh sửa thông tin danh mục" : "Nhập thông tin danh mục bên dưới"}</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Tên danh mục */}
          <div style={{ marginBottom: "1rem" }}>
            <label>Tên danh mục</label>
            <input
              type="text"
              value={name}
              onChange={handleNameChange}
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

            <button
              type="submit"
              className="btn confirm"
              disabled={loading}
            >
              {loading
                ? "Đang lưu..."
                : editingCate
                ? "Cập nhật Category"
                : "Thêm Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;
