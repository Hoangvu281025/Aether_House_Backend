import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/axios";

import "./Products.css";
import Spinner from "../../components/spinner/spinner";

const Products = () => {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' | 'update'
  const [editingId, setEditingId] = useState(null);
  const [products, setProducts] = useState([]);
  const [cate , setCate] = useState([]);


  const [loading, setLoading] = useState(false);
  

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [colspan, setColspan] = useState(1);
  const [category_id, setCategory_id] = useState("");
  const [images, setImages] = useState([]);

  const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.products);

      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  const fetchCate = async () => {
    try {
      const response = await api.get("/categories/catechild");
      setCate(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchCate();
  }, []);
    
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

  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setQuantity("");
    setColspan(1);
    setCategory_id("");
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", name);
      fd.append("price", price);
      fd.append("description", description);
      fd.append("quantity", quantity);
      fd.append("colspan", colspan);
      fd.append("category_id", category_id);
      if (images && images.length) {
        for (const file of images) {
          fd.append("images", file);
        }
      } 

      if (modalMode === "update" && editingId) {
        setLoading(true);
        const { data } = await api.put(`/stores/${editingId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        // cập nhật list tại chỗ (nếu API trả store mới)
        if (data?.store) {
          setProducts((prev) =>
            prev.map((s) => (s._id === editingId ? data.store : s))
          );
        } else {
          // fallback: refetch
          await fetchProducts();
        }
        alert("Cập nhật cửa hàng thành công!");
      } else if (modalMode === "add") {
        // ADD
        setLoading(true);
        const { data } = await api.post("/products", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (data?.store) {
          setProducts((prev) => [data.store, ...prev]);
        } else {
          await fetchProducts();
        }
        alert("Thêm cửa hàng thành công!");
      }else {
        alert("Chế độ không hợp lệ");
        return;
      }
      resetForm();
      closeConfirm();
      setLoading(false);
    } catch (err) {
      console.error("Lỗi khi lưu:", err?.response?.data || err.message);
      alert("Lưu thất bại!");
    }
  };


  return (
    <div className="products-container">
      <div className="products-header">
        <h2>Products List</h2>
        <p>Track your store's progress to boost your sales.</p>
      </div>

      <div className="products-actions">
        <input type="text" placeholder="Search..." className="search-input" />
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
            <th>
              <input type="checkbox" />
            </th>
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
          {products.map((item) => {
            const mainImage = item.images.find(img => img.is_main) || item.images[0];

            return (
              <tr key={item._id}>
                <td>
                  <input type="checkbox" />
                </td>
                <td className="product-info">
                  <img 
                    src={mainImage?.url} 
                    alt={item.name} 
                    className="product-img" 
                  />
                  <span>{item.name}</span>
                </td>
                <td>{item.category_id.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>
                  <span
                      className={`stock-badge ${
                        item.quantity > 0 ? "in-stock" : "out-stock"
                      }`}
                    >
                      {item.quantity > 0 ? "In Stock" : "Out of Stock"}
                  </span>

                </td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="button_wrapper">
                    <button className="btn1 btn">Update</button>
                    <button className="btn2 btn">Delete</button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>

      </table>

      {confirmOpen && (
        <div className="pop-up-store" onClick={closeConfirm}>
          <div
            className="pop-up-content-form"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="form-title">
              {modalMode === "update" ? "Update Product" : "Add New Product"}
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
                    />
                  </div>

                  <div className="form-group">
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="Price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>description</label>
                    <input
                      type="text"
                      placeholder="Description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Quantity</label>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Images</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = [...e.target.files];
                        if (files.length > 2) {
                          alert("Chỉ được upload tối đa 2 hình thôi nha!");
                          return;
                        }
                        setImages(files);
                      }}
                    />
                  </div>
                </div>

                <div className="form-column">
                  <div className="form-group">
                    <label>Colspan</label>
                    <select name="" id="" value={colspan} onChange={(e) => setColspan(e.target.value)}>
                      <option value="1">1</option>
                      <option value="2">2</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category</label>
                    <select name="" id="" value={category_id} onChange={(e) => setCategory_id(e.target.value)}>
                      {cate.map((item) => (
                        <option key={item._id} value={item._id}>{item.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      placeholder="Store description"
                    />
                  </div>

                  
                </div>
              </div>

              <div className="btn-row">
                
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? (
                    <Spinner />
                  ) : (
                    modalMode === "update" ? "Save Changes" : "Save Products"
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
};

export default Products;
