import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import "./Profile.css";
// import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
// import { LuX } from "react-icons/lu";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [address, setAddress] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);

    const token = JSON.parse(localStorage.getItem("user"));
    const id = token._id;
    useEffect(() => {
        
        const fetchUser = async () => {
        try {
            const { data } = await api.get(`/users/${id}`);
            console.log(data)
            setUser(data?.user || []); 
            setAddress(data?.addresses || []); 
            
        } catch (err) {
            console.error("Lỗi khi lấy user:", err); 
        } 
        };
        fetchUser();
    
    }, [id]);

    const openConfirm = (mode) => {
        setModalMode(mode);
        setConfirmOpen(true);    
    };

    const closeConfirm = () => {
        setConfirmOpen(false);
    };

    const handleFileChange = (e) => {
        setAvatarFile(e.target.files[0]);
    };

    const handleSaveAvatar = async () => {
        if (!avatarFile) return alert("Chưa chọn file!");

        const formData = new FormData();
        formData.append("avatar", avatarFile);

        try {
            const { data } = await api.put(`/users/${id}/avataradmin`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (data.success) {
                // Cập nhật localStorage
                localStorage.setItem("user", JSON.stringify(data.user));

                // Cập nhật state user (render lại avatar mới)
                setUser(data.user);

                alert("Cập nhật avatar thành công!");
                window.location.reload()
            }
        } catch (err) {
            console.error("Lỗi update avatar:", err);
            alert("Lỗi khi cập nhật avatar!");
        }
    };

    if (!user) {
        return (
        <div className="profile-container">
            <p>Đang tải hoặc không tìm thấy user.</p>
        </div>
        );
    }
    return (
        
        <div className="profile-container">

       
            <div className="profile-card" >
                <div className="profile-info">
                    <img
                        src={user.avatar.url}
                        alt="avatar"
                        className="profile-avatar"
                    />
                <div>
                    <h2 className="profile-name">{user.email}</h2>
                    <p className="profile-role">{user.role_id.name.toUpperCase()}</p>
                </div>
                </div>
                <div className="profile-actions">
                {/* <button className="icon-btn">
                    <FaFacebookF />
                </button>
                <button className="icon-btn">
                    <LuX />
                </button>
                <button className="icon-btn">
                    <FaLinkedinIn />
                </button>
                <button className="icon-btn">
                    <FaInstagram />
                </button> */}
                <button className="edit-btn" onClick={()=>openConfirm("avatar")}>Edit</button>
                </div>
            </div>

     
            <div className="profile-card">
                <div className="section-header">
                <h3>Personal Information</h3>
                <button className="edit-btn" onClick={()=>openConfirm("infor")}>Edit</button>

                </div>
                <div className="info-grid">
                    {/* <div>
                        <p className="label">Full Name</p>
                        <p className="value">Chowdury</p>
                    </div> */}
                    {/* <div>
                        <p className="label">Last Name</p>
                        <p className="value">Musharof</p>
                    </div> */}
                    <div>
                        <p className="label">Email address</p>
                        <p className="value">{user.email}</p>
                    </div>
                </div>
            </div>

        {/* Address */}
            {address.map((addresses) =>(
                <div className="profile-card" key={addresses._id}>
                    <div className="section-header">
                        <h3>Address</h3>
                        <button className="edit-btn" onClick={()=>openConfirm("address")}>Edit</button>

                    </div>
                    <div className="info-grid">
                    <div>
                        <p className="label">Address</p>
                        <p className="value">{addresses.address}</p>
                    </div>
                
                    <div>
                        <p className="label">ward</p>
                        <p className="value">{addresses.ward}</p>
                    </div>
                    <div>
                        <p className="label">Country</p>
                        <p className="value">{addresses.country}</p>
                    </div>
                    <div>
                        <p className="label">Phone</p>
                        <p className="value">{addresses.phone}</p>
                    </div>
                    </div>
                </div>
            ))}


        {confirmOpen && (
            <div className="modal-overlay">
                <div className="modal">
                    <div className="modal-head">
                        <h2>Edit Personal Information</h2>
                        <p>Update your details to keep your profile up-to-date.</p>
                        <button className="icon close" type="button" onClick={closeConfirm}>✕</button>
                    </div>
                    {modalMode === "avatar" && (
                        <div className="avatar-row">
                            <img className="avatar_profile" src={user.avatar.url} alt="avatar" />
                            <div className="avatar-actions">
                                <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={handleFileChange}/>
                            </div>
                        </div>
                    )}

                    {modalMode === "infor" && (
                        <>
                        <h4 className="section-title">Personal Information</h4>

                        <div className="grid grid-2 gap">
                            <div>
                                <label>Full Name</label>
                                <input name="FullName" placeholder="Doe" />
                            </div>
                            <div>
                                <label>Email Address</label>
                                <input name="email" type="email" placeholder="john@example.com" />
                            </div>
                        </div>
                        </>
                    )}

                    {modalMode === "address" && (
                        <>
                        <h4 className="section-title">Personal address</h4>

                        <div className="grid grid-2 gap">
                            <div>
                                <label>Address</label>
                                <input name="FullName" placeholder="Doe" />
                            </div>
                            <div>
                                <label>Ward</label>
                                <input name="email" type="email" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label>Country</label>
                                <input name="email" type="email" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label>Phone</label>
                                <input name="email" type="email" placeholder="john@example.com" />
                            </div>
                        </div>
                        </>
                    )}

                    <div className="footer">
                    {modalMode === "avatar" && (
                        <button className="btn primary" type="button" onClick={handleSaveAvatar}>Save Changes avatar</button>
                    )}
                    {modalMode === "infor" && (
                        <button className="btn primary" type="button">Save Changes infor</button>
                    )}
                    {modalMode === "address" && (
                        <button className="btn primary" type="button">Save Changes address</button>
                    )}
                    </div>
                </div>
            </div>
        )}
    </div>
    
)}


export default Profile;