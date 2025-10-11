import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import dayjs from "dayjs";
import "../users/Users.css";
import CategoryForm from "./CategoryForm";

const Category = () => {
  const [cates, setCates] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingCate, setEditingCate] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/categories?page=${page}&limit=${limit}`);
      setCates(data?.categories || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      console.error("Lỗi khi lấy category:", err);
      setCates([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [page, limit]);

  // 👉 Mở form thêm mới
  const openForm = () => {
    setEditingCate(null);
    setShowForm(true);
  };

  // 👉 Mở form sửa category
  const handleEdit = (cate) => {
    setEditingCate(cate);
    setShowForm(true);
  };

  // 👉 Xóa category
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xoá danh mục này không?")) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error("Lỗi khi xoá:", err);
      }
    }
  };

  return (
    <div className="user-table-wrapper">
      <div className="user-title">
        <h2>Category List</h2>
      </div>

      <div className="table_user">
        <h3 className="table_user-title">
          Category
          <button className="btn confirm" onClick={openForm}>
            + Add Category
          </button>
        </h3>

        <hr />

        <div className="table_users">
          <div className="table_users-box">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Created</th>
                    {/* <th>Actions</th> */}
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={5}>
                        <div className="table-loading">
                          <span className="spinner" />
                        </div>
                      </td>
                    </tr>
                  ) : cates.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-row">
                        Không có category.
                      </td>
                    </tr>
                  ) : (
                    cates.map((cate) => (
                      <tr key={cate._id}>
                        <td>
                          <div className="user">
                            <div>
                              <div className="u-name">{cate.name}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`chip ${
                              cate.status === "active" ? "active" : "inactive"
                            }`}
                          >
                            {cate.status === "active" ? "Hoạt động" : "Bị khóa"}
                          </span>
                        </td>
                        <td>{dayjs(cate.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                      <td className="budget">
                        <div className="button_wrapper">
                          <button
                            className="btn btn1"
                            onClick={() => handleEdit(cate)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn2"
                            onClick={() => handleDelete(cate._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="pagination">
              <button
                className="nav prev"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
              >
                Previous
              </button>

              <div className="pages">
                {[...Array(totalPages)].map((_, i) => {
                  const n = i + 1;
                  return (
                    <button
                      key={n}
                      className={`page-num ${page === n ? "active" : ""}`}
                      onClick={() => setPage(n)}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>

              <button
                className="nav next"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FORM ADD / EDIT */}
      {showForm && (
        <CategoryForm
          onClose={() => setShowForm(false)}
          refreshList={fetchCategories}
          editingCate={editingCate} // Truyền category cần sửa
        />
      )}
    </div>
  );
};

export default Category;
