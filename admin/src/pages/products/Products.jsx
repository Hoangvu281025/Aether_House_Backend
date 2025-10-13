import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import "./Products.css";
import Spinner from "../../components/spinner/spinner";
import VariantPreview from "./VariantPreview";
import VariantForm from "./VariantForm";
import { getMainImage } from "./products.helpers";

export default function Products() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingId, setEditingId] = useState(null);

  const [products, setProducts] = useState([]);
  const [cate, setCate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [colspan, setColspan] = useState(1);
  const [category_id, setCategory_id] = useState("");
  const [images, setImages] = useState([]);

  
  // ===== API =====
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products);
    } finally {
      setLoading(false);
    }
  };

  const fetchCate = async () => {
    const res = await api.get("/categories/catechild");
    setCate(res.data.categories);
  };

  useEffect(() => {
    fetchProducts();
    fetchCate();
  }, []);

  // ===== Product add/update modal =====
  const openConfirm = (mode, id = null) => {
    setModalMode(mode);
    setEditingId(id);
    setConfirmOpen(true);
  };
  const closeConfirm = () => {
    resetForm();
    setConfirmOpen(false);
    setEditingId(null);
  };
  const resetForm = () => {
    setName(""); setPrice(""); setDescription("");
    setQuantity(""); setColspan(1); setCategory_id(""); setImages([]);
  };

  useEffect(() => {
    if (!confirmOpen || modalMode !== "update" || !editingId) return;
    const current = products.find((s) => s._id === editingId);
    if (current) {
      setName(current.name || "");
      setPrice(current.price || "");
      setDescription(current.description || "");
      setQuantity(current.quantity || "");
      setColspan(current.colspan || 1);
      setCategory_id(current.category_id?._id || current.category_id || "");
    }
  }, [confirmOpen, modalMode, editingId, products]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    fd.append("price", price);
    fd.append("description", description);
    fd.append("quantity", quantity);
    fd.append("colspan", colspan);
    fd.append("category_id", category_id);
    images?.forEach?.((f) => fd.append("images", f));

    try {
      setLoading(true);
      if (modalMode === "update" && editingId) {
        const { data } = await api.put(`/products/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data?.product) {
          setProducts((prev) => prev.map((p) => (p._id === editingId ? data.product : p)));
        } else await fetchProducts();
        alert("Cập nhật sản phẩm thành công!");
      } else {
        const { data } = await api.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data?.product) setProducts((prev) => [data.product, ...prev]);
        else await fetchProducts();
        alert("Thêm sản phẩm thành công!");
      }
      closeConfirm();
    } catch (err) {
      console.error(err?.response?.data || err.message);
      alert("Lưu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  const handleHide = async (id) => {
  if (!window.confirm("Bạn có chắc muốn ẩn sản phẩm này?")) return;
  try {
    await api.patch(`/products/${id}/hide`); // BE: set is_hidden = true

    // chỉ cập nhật cờ is_hidden cho item đó
    setProducts(prev =>
      prev.map(p => (p._id === id ? { ...p, is_hidden: true } : p))
    );

    alert("Đã chuyển sản phẩm sang trạng thái Inactive.");
  } catch (e) {
    console.error(e);
    alert("Ẩn sản phẩm thất bại!");
  }
  };
  const handleActive = async (id) => {
  // if (!window.confirm("Bạn có chắc muốn ẩn sản phẩm này?")) return;
  try {
    await api.patch(`/products/${id}/unhide`); // BE: set is_hidden = true

    // chỉ cập nhật cờ is_hidden cho item đó
    setProducts(prev =>
      prev.map(p => (p._id === id ? { ...p, is_hidden: false } : p))
    );

    alert("Đã chuyển sản phẩm sang trạng thái Inactive.");
  } catch (e) {
    console.error(e);
    alert("Ẩn sản phẩm thất bại!");
  }
  };


  // ===== Variants flow (open/close) =====
  // state
const [variantPreviewOpen, setVariantPreviewOpen] = useState(false);
const [variantProduct, setVariantProduct] = useState(null);

// open/close
const openVariantPreview = (productId) => {
  const prod = products.find((p) => p._id === productId);
  setVariantProduct(prod || null);
  setVariantPreviewOpen(true);
};
const closeVariantPreview = () => {
  setVariantPreviewOpen(false);
  setVariantProduct(null);
};



  // xóa 1 variant
  

  // submit add / update variant

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products List</h2>
        <p>Track your store's progress to boost your sales.</p>
      </div>

      <div className="products-actions">
        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="btn-group">
          <button className="btn export">Export ⬇</button>
          <button className="btn add" onClick={() => openConfirm("add")}>
            + Add Product
          </button>
        </div>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>Products</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((item) => {
            const mainImage = getMainImage(item);
            return (
              <tr key={item._id}>
                <td><input type="checkbox" /></td>
                <td className="product-info">
                  <img src={mainImage?.url} alt={item.name} className="product-img" />
                  <span>{item.name}</span>
                </td>
                <td>{item.category_id?.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>
                  {(() => {
                    const isHidden = item.is_hidden === true;
                    const inStock = item.quantity > 0;
                    const statusLabel = isHidden
                      ? "Inactive"
                      : inStock
                      ? "In Stock"
                      : "Out of Stock";
                    const statusClass = isHidden
                      ? "inactive"
                      : inStock
                      ? "in-stock"
                      : "out-stock";

                    return (
                      <span className={`stock-badge ${statusClass}`}>
                        {statusLabel}
                      </span>
                    );
                  })()}
                </td>

                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="button_wrapper">
                    <button className="btn1 btn" onClick={() => openVariantPreview(item._id)}>
                      Add Variant
                    </button>
                    <button className="btn1 btn" onClick={() => openConfirm("update", item._id)}>
                      Update
                    </button>
                    {/* <button className="btn1 btn" onClick={() => openVariantPreview(item._id)}>
                      Add Variant
                    </button> */}
                    {item.is_hidden ? (
                    <button className="btn1 btn" onClick={() => handleActive(item._id)}>
                      Activate
                    </button>
                    ):(
                    <button className="btn2 btn" onClick={() => handleHide(item._id)}>
                      Hide
                    </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Product Add/Update Modal */}
      {confirmOpen && (
        <div className="pop-up-store" onClick={closeConfirm}>
          <div className="pop-up-content-form" onClick={(e) => e.stopPropagation()}>
            <h2 className="form-title">
              {modalMode === "update" ? "Update Product" : "Add New Product"}
            </h2>

            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-column">
                  <div className="form-group">
                    <label>Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Product name" />
                  </div>
                  <div className="form-group">
                    <label>Price</label>
                    <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
                  </div>
                  <div className="form-group">
                    <label>Quantity</label>
                    <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Quantity" />
                  </div>
                  <div className="form-group">
                    <label>Images</label>
                    <input type="file" multiple accept="image/*"
                      onChange={(e) => {
                        const files = [...e.target.files];
                        if (files.length > 2) return alert("Chỉ được upload tối đa 2 hình!");
                        setImages(files);
                      }} />
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-group">
                    <label>Colspan</label>
                    <select value={colspan} onChange={(e) => setColspan(e.target.value)}>
                      <option value="1">1</option><option value="2">2</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={String(category_id || "")} onChange={(e) => setCategory_id(e.target.value)}>
                      <option value="">-- Select --</option>
                      {cate.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Product description" />
                  </div>
                </div>
              </div>

              <div className="btn-row">
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? <Spinner /> : (modalMode === "update" ? "Save Changes" : "Save Product")}
                </button>
                <button type="button" className="cancel-btn" onClick={closeConfirm}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {variantPreviewOpen && variantProduct && (
  <VariantPreview
    product={variantProduct}
    onClose={closeVariantPreview}
    // onOpenForm={() => setVariantFormOpen(true)}
  />
)}

    </div>
  );
}
