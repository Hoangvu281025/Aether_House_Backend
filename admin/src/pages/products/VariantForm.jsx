import React from "react";
import Spinner from "../../components/spinner/spinner"; // chỉnh path nếu khác

export default function VariantForm({
  mode = "add",                // "add" | "update"
  onClose,
  onSubmit,
  loading,
  colorName,
  hexCode,
  setColorName,
  setHexCode,
  setImages,                   // vẫn nhận ảnh, chỉ bỏ phần preview UI
}) {
  return (
    <div className="pop-up-store modal-layer-2" onClick={onClose}>
      <div
        className="pop-up-content-form"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <h2 className="form-title">
          {mode === "update" ? "Update Variant" : "New Variant"}
        </h2>

        <form className="product-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <div className="form-column">
              <div className="form-group">
                <label>Tên Màu</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Đỏ, Xanh, Trắng..."
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
                  pattern="^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
                  required
                />
                {hexCode && (
                  <div
                    style={{
                      width: "50px",
                      height: "25px",
                      backgroundColor: hexCode,
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      marginTop: "5px",
                    }}
                  />
                )}
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Hình Ảnh (không bắt buộc)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setImages([...e.target.files])}
                />
                {/* Không hiển thị preview hình theo yêu cầu */}
              </div>
            </div>
          </div>

          <div className="btn-row">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <Spinner /> : (mode === "update" ? "Save Changes" : "Save Variant")}
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
