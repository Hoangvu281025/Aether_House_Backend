import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import dayjs from "dayjs";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);

  // ==== Module popup state ====
  const [moduleOpen, setModuleOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [savingModules, setSavingModules] = useState(false);

  // 3 quyền chuẩn hoá chữ thường: 'all' | 'store' | 'product'
  const [modAll, setModAll] = useState(false);
  const [modStore, setModStore] = useState(false);
  const [modProduct, setModProduct] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/users/admins/?page=${page}&limit=${limit}`);
        if (!alive) return;
        setUsers(data?.users || []);
        setTotalPages(data?.totalPages || 1);
      } catch (err) {
        console.error("Fetch users error:", err);
        if (alive) {
          setUsers([]);
          setTotalPages(1);
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [page, limit]);

  // ===== Open/Close Module Popup =====
  const openModulePopup = async (user) => {
    setTargetUser(user);
    setModuleOpen(true);
    setModulesLoading(true);
    try {
      // lấy modules “đúng route”
      const { data } = await api.get(`/users/${user._id}`);
      const mods = Array.isArray(data?.user?.modules) ? data.user.modules.map(String) : [];

      setModAll(mods.includes("all"));
      setModStore(mods.includes("store"));
      setModProduct(mods.includes("product"));
    } catch (e) {
      console.error("Load modules error:", e);
      setModAll(false);
      setModStore(false);
      setModProduct(false);
    } finally {
      setModulesLoading(false);
    }
  };

  const closeModulePopup = () => {
    setModuleOpen(false);
    setTargetUser(null);
    setModAll(false);
    setModStore(false);
    setModProduct(false);
  };

  // ===== Save modules (PUT ghi đè) =====
  const handleSaveModules = async () => {
    if (!targetUser) return;
    try {
      setSavingModules(true);
      const modules = [];
      if (modAll) modules.push("all");
      if (modStore) modules.push("store");
      if (modProduct) modules.push("product");

      const { data } = await api.put(`/users/${targetUser._id}/modules`, { modules });

      // cập nhật list users để reflect nhanh (nếu BE trả user đã update)
      if (data?.user) {
        setUsers((prev) =>
          prev.map((u) => (u._id === data.user._id ? { ...u, modules: data.user.modules } : u))
        );
      }
      alert("Cập nhật module thành công!");
      closeModulePopup();
    } catch (e) {
      console.error("Save modules error:", e);
      alert("Lưu module thất bại!");
    } finally {
      setSavingModules(false);
    }
  };

  return (
    <div className="user-table-wrapper">
      <div className="user-title">
        <h2>User List</h2>
      </div>

      <div className="table_user">
        <h3 className="table_user-title">User</h3>
        <hr />

        <div className="table_users">
          <div className="table_users-box">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Avatar</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th></th>
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
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="empty-row">
                        Không có người dùng.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id}>
                        <td>
                          <div className="user">
                            <img className="avatar" src={user.avatar?.url} alt="" />
                            <div>
                              <div className="u-name">{user.name}</div>
                              <div className="u-role">{user.role_id?.name}</div>
                              <div className="u-role">
                                {Array.isArray(user.modules) ? user.modules.join(", ") : ""}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`chip ${user.isActive ? "active" : "inactive"}`}>
                            {user.isActive ? "Active" : "Disabled"}
                          </span>
                        </td>
                        <td>{dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                        <td className="budget">
                          {/* mở popup Add Module */}
                          <button onClick={() => openModulePopup(user)} title="Add Module">
                            <svg
                              className="fill-current"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="white"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M5.99902 10.245C6.96552 10.245 7.74902 11.0285 7.74902 11.995V12.005C7.74902 12.9715 6.96552 13.755 5.99902 13.755C5.03253 13.755 4.24902 12.9715 4.24902 12.005V11.995C4.24902 11.0285 5.03253 10.245 5.99902 10.245ZM17.999 10.245C18.9655 10.245 19.749 11.0285 19.749 11.995V12.005C19.749 12.9715 18.9655 13.755 17.999 13.755C17.0325 13.755 16.249 12.9715 16.249 12.005V11.995C16.249 11.0285 17.0325 10.245 17.999 10.245ZM13.749 11.995C13.749 11.0285 12.9655 10.245 11.999 10.245C11.0325 10.245 10.249 11.0285 10.249 11.995V12.005C10.249 12.9715 11.0325 13.755 11.999 13.755C12.9655 13.755 13.749 12.9715 13.749 12.005V11.995Z"
                              />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <button className="nav prev" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>
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

            {/* ===== POPUP: ADD MODULE ===== */}
            {moduleOpen && (
              <div className="pop-up" onClick={closeModulePopup}>
                <div className="pop-up-content" onClick={(e) => e.stopPropagation()}>
                  <div className="pop-up-content-header">
                    <h2>Thêm Module cho {targetUser?.name || targetUser?.email}</h2>
                    <p>Tick quyền cần cấp rồi bấm Save.</p>
                  </div>

                  {modulesLoading ? (
                    <div className="popup-loading-state">
                      <div className="spinner big" />
                      <p>Đang tải module…</p>
                    </div>
                  ) : (
                    <>
                      <div className="mod-grid">
                        <label className="mod-item">
                          <input
                            type="checkbox"
                            checked={modAll}
                            onChange={(e) => setModAll(e.target.checked)}
                          />
                          <div className="mod-info">
                            <div className="mod-name">ALL</div>
                            <div className="mod-desc">Quản lý tất cả</div>
                          </div>
                        </label>

                        <label className="mod-item">
                          <input
                            type="checkbox"
                            checked={modStore}
                            onChange={(e) => setModStore(e.target.checked)}
                          />
                          <div className="mod-info">
                            <div className="mod-name">STORE</div>
                            <div className="mod-desc">Quản lý cửa hàng</div>
                          </div>
                        </label>

                        <label className="mod-item">
                          <input
                            type="checkbox"
                            checked={modProduct}
                            onChange={(e) => setModProduct(e.target.checked)}
                          />
                          <div className="mod-info">
                            <div className="mod-name">PRODUCT</div>
                            <div className="mod-desc">Quản lý sản phẩm</div>
                          </div>
                        </label>
                      </div>

                      <div className="pop-up-content-actions">
                        <button className="btn cancel" onClick={closeModulePopup}>
                          Huỷ
                        </button>
                        <button
                          className="btn confirm"
                          onClick={handleSaveModules}
                          disabled={savingModules}
                        >
                          {savingModules ? "Saving…" : "Save"}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* ===== /POPUP ===== */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
