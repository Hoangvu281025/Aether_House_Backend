// src/pages/products/VariantPreview.jsx
import React from "react";

export default function VariantPreview({ product, onClose, onOpenForm }) {
  if (!product) return null;

  return (
    <div className="poplayer" onClick={onClose}>
      <div
        className="popwrap"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add Variant"
      >
        <h3 className="pop-title">Add Variant</h3>

        <div className="vp-grid">
          {/* LEFT: product info (image + name) */}
          <div className="vp-left">
            <div className="card_variant">
              <img
                src={product?.images?.find?.(i=>i.is_main)?.url || product?.images?.[0]?.url}
                alt={product?.name || "product"}
                className="prod-img"
              />
              <div className="prod-name">{product?.name}</div>
            </div>
          </div>

          {/* RIGHT: big plus button */}
          <div className="vp-right">
            <div className="card_variant center">
              <button
                type="button"
                className="btn-plus"
                onClick={onOpenForm}
                title="Create Variant"
                aria-haspopup="dialog"
              >
                ＋
              </button>
              <div className="plus-label">Create Variant</div>
            </div>
          </div>
        </div>

        <button className="pop-close" onClick={onClose} aria-label="Close">✕</button>
      </div>
    </div>
  );
}
