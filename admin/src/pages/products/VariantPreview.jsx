import React, { useState, useEffect } from "react";
import VariantForm from "./VariantForm";
import api from "../../lib/axios";
import "./VariantPreview.css";

export default function VariantPreview({ product, onClose }) {
  const [showForm, setShowForm] = useState(false);
  const [editingVariant, setEditingVariant] = useState(null);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Lấy danh sách màu của sản phẩm
  const fetchVariants = async () => {
    if (!product?._id) return;
    try {
      setLoading(true);
      const res = await api.get(`/variants/by-product/${product._id}`);
      setVariants(res.data?.Variation || []);
    } catch (err) {
      console.error("Failed to load variants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [product]);

  // ✅ Mở form thêm mới
  const handleOpenForm = () => {
    setEditingVariant(null);
    setShowForm(true);
  };

  // ✅ Đóng form
  const handleCloseForm = () => setShowForm(false);

  // ✅ Mở form cập nhật
  const handleUpdateVariant = (variant) => {
    setEditingVariant(variant);
    setShowForm(true);
  };

  // ✅ XÓA toàn bộ 1 màu (color + hình ảnh)
  const handleDeleteVariant = async (variant) => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa toàn bộ màu "${variant.color}" và các hình ảnh của nó không?`
    );
    if (!confirmDelete) return;

    try {
      const res = await api.delete(
        `/variants/by-product/${product._id}/colors/${variant._id}`
      );

      if (res.data?.success) {
        alert("Đã xóa thành công!");
        fetchVariants(); // reload danh sách
      } else {
        alert(res.data?.message || "Xóa thất bại!");
      }
    } catch (err) {
      console.error("Delete variant failed:", err);
      alert("Lỗi server khi xóa variant!");
    }
  };

  return (
    <>
      <div className="poplayer" onClick={onClose}>
        <div
          className="popwrap"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <h3 className="pop-title">Variants of {product?.name}</h3>

          <div className="vp-grid">
            {/* LEFT: Hình sản phẩm chính */}
            <div className="vp-left product-column">
              <h4>Main Product</h4>
              {product?.images?.length > 0 ? (
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="main-prod-img"
                />
              ) : (
                <p>Chưa có hình sản phẩm</p>
              )}
              <div className="prod-name">{product?.name}</div>
            </div>

            {/* RIGHT: Danh sách variant */}
            <div className="vp-right variants-column">
              <h4>Variants</h4>

              {loading ? (
                <p>Đang tải...</p>
              ) : variants.length === 0 ? (
                <p>Chưa có màu nào</p>
              ) : (
                <div className="variant-list">
                  {variants.map((v, i) => (
                    <div key={i} className="card_variant">
                      <img
                        src={v.images?.[0]?.url || ""}
                        alt={v.color}
                        className="prod-img"
                      />
                      <div className="prod-name">{v.color}</div>
                      <div
                        className="color-dot"
                        style={{
                          backgroundColor: v.hex,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          border: "1px solid #ccc",
                        }}
                      ></div>

                      {/* ✅ Các nút hành động */}
                      <div className="variant-actions">
                        <button
                          className="btn-update"
                          onClick={() => handleUpdateVariant(v)}
                        >
                          Update
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteVariant(v)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Nút thêm variant */}
              <div className="add-variant">
                <button
                  type="button"
                  className="btn-plus"
                  onClick={handleOpenForm}
                  title="Create Variant"
                  aria-haspopup="dialog"
                >
                  ＋
                </button>
                <div className="plus-label">Add New Color</div>
              </div>
            </div>
          </div>

          <button className="pop-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
      </div>

      {/* Form thêm hoặc update màu */}
      {showForm && (
        <VariantForm
          mode={editingVariant ? "update" : "add"}
          variant={editingVariant}
          onClose={handleCloseForm}
          onSuccess={() => {
            fetchVariants();
          }}
          productId={product._id}
        />
      )}
    </>
  );
}
