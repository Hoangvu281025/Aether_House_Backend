import React, { useEffect, useState } from "react";
import api from "../../lib/axios"

import "./Users.css";
  
// const users = [
//   {
//     id: 1,
//     name: "Lindsey Curtis",
//     role: "Web Designer",
//     avatar: "https://i.pravatar.cc/40?img=1",
//     phone: "0901234567",
//     email: "lindsey@example.com",
//     created_at: "2024-09-01",
//   },
//   {
//     id: 2,
//     name: "Kaiya George",
//     role: "Project Manager",
//     avatar: "https://i.pravatar.cc/40?img=2",
//     phone: "0902345678",
//     email: "kaiya@example.com",
//     created_at: "2024-08-25",
//   },
//   {
//     id: 3,
//     name: "Zain Geidt",
//     role: "Content Writer",
//     avatar: "https://i.pravatar.cc/40?img=3",
//     phone: "0903456789",
//     email: "zain@example.com",
//     created_at: "2024-08-10",
//   },
//   {
//     id: 4,
//     name: "Abram Schleifer",
//     role: "Digital Marketer",
//     avatar: "https://i.pravatar.cc/40?img=4",
//     phone: "0904567890",
//     email: "abram@example.com",
//     created_at: "2024-07-22",
//   },
//   {
//     id: 5,
//     name: "Carla George",
//     role: "Front-end Developer",
//     avatar: "https://i.pravatar.cc/40?img=5",
//     phone: "0905678901",
//     email: "carla@example.com",
//     created_at: "2024-07-01",
//   },
// ];

const Users = () => {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/users'); // hoặc api.get("/users")
        setUsers(data);
      } catch (err) {
        console.error("Lỗi khi lấy user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  },[])

  if (loading) return <p>Đang tải danh sách người dùng...</p>;
  return (
    <div className="user-table-wrapper">
      <h2>User Table</h2>
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  <div className="user-info">
                    <img src={u.avatar.url} alt={u.name} className="avatar" />
                    <div>
                      <p className="name">{u.name}</p>
                      <p className="role">{u.role}</p>
                    </div>
                  </div>
                </td>
                <td>{u.phone}</td>
                <td>{u.email}</td>
                <td>{u.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
