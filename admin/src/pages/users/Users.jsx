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
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [targetUser, setTargetUser] = useState(true);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/users?page=${page}&limit=${limit}`);
        if (!isMounted) return;
        setUsers(data?.users || []);
        setTotalPages(data?.totalPages || 1);
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
        if (isMounted) {
          setUsers([]);
          setTotalPages(1);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => { isMounted = false; };
  }, [page, limit]);


  const openConfirm = (user) => {
    setTargetUser(user);       // gán user cần duyệt
    setConfirmOpen(true);      // mở modal
  };


  const closeConfirm = () => {
    setConfirmOpen(false);
    setTargetUser(null);
  };

  const hanldeConfirm = async() => {
    if(!targetUser) return;

    try {
      setConfirmLoading(true);
      

      await api.put(`/users/${targetUser._id}/approve`);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === targetUser._id
            ? { ...user, approvalStatus: user.approvalStatus == "approved" ? "pending" : "approved" }
            : user
        )
      );
      await new Promise((r) => setTimeout(r, 2000));
      
      setTargetUser(null)
      setConfirmOpen(false)
    } catch (error) {
      console.log(error)
    }finally{
      setConfirmOpen(false)
      setConfirmLoading(false);
    }
  }


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
                          {/* <span>Đang tải danh sách người dùng...</span> */}
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
                            <img
                              className="avatar"
                              src={user.avatar.url}
                              alt=""
                            />
                            <div>
                              <div className="u-name">{user.name}</div>
                              <div className="u-role">{user.role_id.name}</div>
                            
                            </div>
                          </div>
                        </td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`chip ${user.approvalStatus }`}>
                            {user.approvalStatus}
                          </span>
                        </td>
                        <td>{dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                        <td className="budget">
                          <button onClick={() => openConfirm(user)}>
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

            {confirmOpen && (
              <div className="pop-up">
                <div className="pop-up-content">
                  {/* Khi chưa loading thì hiện nội dung bình thường */}
                  {!confirmLoading ? (
                    <>
                      <div className="pop-up-content-header">
                        <h2>Xác nhận duyệt người dùng {targetUser?.name}</h2>
                        <p>
                          Bạn có chắc chắn muốn duyệt người dùng này không? Hành động này sẽ
                          cho phép họ đăng nhập và sử dụng hệ thống.
                        </p>
                      </div>

                      <div className="pop-up-content-actions">
                        <button className="btn cancel" onClick={closeConfirm}>
                          Huỷ
                        </button>
                        <button className="btn confirm" onClick={hanldeConfirm}>
                          Xác nhận
                        </button>
                      </div>
                    </>
                  ) : (
                    // Khi loading thì ẩn nội dung và hiển thị spinner
                    <div className="popup-loading-state">
                      <div className="spinner big" />
                      <p>Cập nhật thành công</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
