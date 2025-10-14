import React, { useState } from "react";
import Spinner from "../../components/spinner/spinner";
import api from "../../lib/axios";
import "./VariantPreview.css";

export default function VariantForm({
  mode = "add",
  variant,
  productId,
  onClose,
  onSuccess,
}) {
  const [colorName, setColorName] = useState(variant?.color || "");
  const [hexCode, setHexCode] = useState(variant?.hex || "");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingImage, setUpdatingImage] = useState(null);

  // ✅ handle ADD (thêm mới variant)
  const handleAddVariant = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("product_id", productId);
      formData.append("color", colorName);
      formData.append("hex", hexCode);
      images.forEach((img) => formData.append("images", img));

      const res = await api.post("/variants/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        alert("Đã thêm màu mới!");
        onSuccess?.();
        onClose?.();
      }
    } catch (err) {
      console.error("Error adding variant:", err);
      alert("Lỗi khi thêm màu!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ handle UPDATE (đổi color/hex)
  const handleUpdateVariant = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.put(
        `/variants/by-product/${productId}/colors/${variant._id}`,
        { color: colorName, hex: hexCode }
      );

      if (res.data?.success) {
        alert("Cập nhật thông tin thành công!");
        onSuccess?.();
        onClose?.();
      }
    } catch (err) {
      console.error("Error updating variant:", err);
      alert("Lỗi khi cập nhật!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ handle UPDATE 1 ảnh (gọi API updateSingleImage)
  const handleUpdateSingleImage = async (imageId, file) => {
    try {
      if (!file) return;
      setUpdatingImage(imageId);

      const formData = new FormData();
      formData.append("image", file);

      const res = await api.put(
        `/variants/${productId}/colors/${variant._id}/image/${imageId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (res.data?.success) {
        alert("Cập nhật ảnh thành công!");
        onSuccess?.();
      }
    } catch (err) {
      console.error("Error updating image:", err);
      alert("Cập nhật ảnh thất bại!");
    } finally {
      setUpdatingImage(null);
    }
  };

  // ✅ hiển thị form
  return (
    <div className="pop-up-store modal-layer-2" onClick={onClose}>
      <div
        className="pop-up-content-form"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="form-title">
          {mode === "add" ? "Thêm Màu Mới" : "Cập Nhật Màu"}
        </h2>

        <form
          className="product-form"
          onSubmit={mode === "add" ? handleAddVariant : handleUpdateVariant}
        >
          <div className="form-grid">
            <div className="form-column">
              <div className="form-group">
                <label>Tên Màu</label>
                <input
                  type="text"
                  value={colorName}
                  onChange={(e) => setColorName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mã Màu (HEX)</label>
                <input
                  type="text"
                  placeholder="#FF0000"
                  value={hexCode}
                  onChange={(e) => setHexCode(e.target.value)}
                  required
                />
                {hexCode && (
                  <div
                    style={{
                      width: "40px",
                      height: "20px",
                      backgroundColor: hexCode,
                      border: "1px solid #ccc",
                      marginTop: "4px",
                    }}
                  />
                )}
              </div>
            </div>

            {/* PHẦN ẢNH */}
            <div className="form-column">
              {mode === "add" ? (
                <div className="form-group">
                  <label>Hình Ảnh</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setImages([...e.target.files])}
                  />
                </div>
              ) : (
                <>
                  <label>Hình Hiện Có</label>
                  <div className="variant-images-grid">
                    {variant?.images?.map((img) => (
                      <div key={img._id} className="variant-img-card">
                        <img src={img.url} alt="variant" />
                        <label className="update-btn">
                          {updatingImage === img._id ? (
                            <Spinner />
                          ) : (
                            <>
                              <span>🖋 Cập nhật</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                  handleUpdateSingleImage(
                                    img._id,
                                    e.target.files[0]
                                  )
                                }
                                style={{ display: "none" }}
                              />
                            </>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="btn-row">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <Spinner /> : "Save"}
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
