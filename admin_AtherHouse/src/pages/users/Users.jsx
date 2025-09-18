import React, { useEffect, useState } from "react";
import api from "../../lib/axios"
import dayjs from "dayjs";

import "./Users.css";
  


const Users = () => {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]); // Dữ liệu gốc để reset khi đổi filter
  const [status, setStatus] = useState("all"); // all | approved | pending
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/users'); 
        console.log(data);
        setUsers(data);
        setAllUsers(data)
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  },[])

  useEffect(() => {
    if (status === "all") {
      setUsers(allUsers);
    } else {
      const filtered = allUsers.filter(
        (u) => u.approvalStatus?.toLowerCase() === status
      );
      setUsers(filtered);
    }
  }, [status, allUsers]);

  if (loading) return <p>Đang tải danh sách người dùng...</p>;
  return (
    <div className="products-container">
      <div className="products-header">
        <h2>user List</h2>
        <p>Track your store's progress to boost your sales.</p>
      </div>

      <div className="products-actions">
        <input type="text" placeholder="Search..." className="search-input" />
        <div className="btn-group">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
        </div>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>Avatar</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Created At</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>
                <input type="checkbox" />
              </td>
              <td className="product-info">
                <img src={user.avatar.url} alt={user.name} className="product-img" />
                
              </td>
              <td>
                <span>{user.name}</span>
              </td>
              <td>{user.email}</td>
              <td>{user.role_id.name}</td>
              <td>
                <span className={`stock-badge ${user.approvalStatus === "pending" ? "approved" : "pending"}`}>
                  {user.approvalStatus}
                </span>
              </td>
              <td>{dayjs(user.createdAt).format("DD/MM/YYYY HH:mm")}</td>
              <td>:</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
