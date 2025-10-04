import React, { useEffect, useState } from "react";
import api from "../../lib/axios";
import "./Profile.css";
import Spinner from "../../components/spinner/spinner"

// import { FaFacebookF, FaLinkedinIn, FaInstagram } from "react-icons/fa";
// import { LuX } from "react-icons/lu";

const Profile = () => {
    const [user, setUser] = useState("");
    const [addressList, setAddress] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [avatarFile, setAvatarFile] = useState(null);
    const [email , SetEmail] = useState('');
    const [name , SetName] = useState('');
    const [addressValue , setAddressValue] = useState('');
    const [wardValue , SetWardValue] = useState('');
    const [countryValue , SetCountryValue] = useState('');
    const [phoneValue , SetPhoneValue] = useState('');
    const [cityValue , SetCityValue] = useState('');
    const [loading , SetLoading] = useState(false);

    const token = JSON.parse(localStorage.getItem("user"));
    const id = token._id;
    if(!id){
        window.location.href = "/logout"; // hoặc route tuỳ hệ thống FE của bạn    
    };
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
        if (mode === "infor" && user) {
            SetName(user?.name || "");
            SetEmail(user?.email || "");
        }  
        if (mode === "address"  && addressList.length > 0) {
            const addr = addressList[0];

            setAddressValue(addr.address || "");
            SetWardValue(addr.ward || "");
            SetCountryValue(addr.country || "");
            SetPhoneValue(addr.phone || "");
            SetCityValue(addr.city || "");
        }
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
    const handleSaveInfor = async () => {
        try {
            SetLoading(true)
            const {data} = await api.put(`/users/${id}/infor`, {name , email});
            if (data.success) {
                // Cập nhật localStorage
                localStorage.setItem("user", JSON.stringify(data.user));
                window.location.reload()
            }
        } catch (err) {
            console.error("Lỗi update infor:", err);
            alert("Lỗi khi cập nhật infor!");
        }finally{
            SetLoading(false)
            setConfirmOpen(false);
        }
    };

    const handleAddAddress = async () => {
        try {
            SetLoading(true);
            console.log(name)
            const payload = {
                name:user.name,
                address: addressValue,
                city: cityValue,
                ward: wardValue,
                country: countryValue,
                phone: phoneValue,
                user_id: id,
            };
            await api.post("/address",payload);
            window.location.reload()
        } catch (error) {
            console.log(error)
            alert('ko được')
        }
    }
    const handleUpAddress = async () => {
        try {
            SetLoading(true);
            const address_id = addressList[0];
            console.log(address_id)
            const payload = {
                name:user.name,
                address: addressValue,
                city: cityValue,
                ward: wardValue,
                country: countryValue,
                phone: phoneValue,
                user_id: id,
            };
            await api.put(`/address/${address_id._id}/upaddress`,payload);
            window.location.reload()
        } catch (error) {
            console.log(error);
            alert('ko được')
        }
    }

    if (!user) {
        return (
        <div className="profile-container">
           <Spinner/>
           <p>Không tìm thấy user</p>
        </div>
        );
    }
    return (
        
        <div className="profile-container">

            {!user ? (
                <div className="profile-container">
                    <Spinner/>
                </div>
            ):(
                <>
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
                            <div>
                                <p className="label">Full Name</p>
                                <p className="value">{user.name || "admin"}</p>
                            </div>
                            <div>
                                <p className="label">Email address</p>
                                <p className="value">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
       
            

        {/* Address */}
        {(addressList && addressList.length > 0) ? (
            addressList.map((addr) =>(
                <div className="profile-card" key={addr._id}>
                    <div className="section-header">
                        <h3>Address</h3>
                        <button className="edit-btn" onClick={()=>openConfirm("address")}>Edit</button>

                    </div>
                    <div className="info-grid">
                    <div>
                        <p className="label">Address</p>
                        <p className="value">{addr.address || ""}</p>
                    </div>
                
                    <div>
                        <p className="label">ward</p>
                        <p className="value">{addr.ward}</p>
                    </div>
                    <div>
                        <p className="label">Country</p>
                        <p className="value">{addr.country}</p>
                    </div>
                    <div>
                        <p className="label">Phone</p>
                        <p className="value">{addr.phone}</p>
                    </div>
                    </div>
                </div>
            ))
        ):(
            <div className="profile-card" >
                <div className="section-header">
                    <h3>Address</h3>
                    <button className="edit-btn" onClick={()=>openConfirm("address")}>Add</button>

                </div>
                <div className="info-grid">
                <div>
                    <p className="label">Address</p>
                    <p className="value"></p>
                </div>
            
                <div>
                    <p className="label">ward</p>
                    <p className="value"></p>
                </div>
                <div>
                    <p className="label">Country</p>
                    <p className="value"></p>
                </div>
                <div>
                    <p className="label">Phone</p>
                    <p className="value"></p>
                </div>
                </div>
            </div>
        )}


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
                        {loading ? (
                            <Spinner/>
                        ): (
                            <>
                            <h4 className="section-title">Personal Information</h4>

                            <div className="grid grid-2 gap">
                                <div>
                                    <label>Full Name</label>
                                    <input name="name" placeholder="Doe" value={name}  onChange={(e) => SetName(e.target.value)} />
                                </div>
                                <div>
                                    <label>Email Address</label>
                                    <input name="email" type="email" value={email} placeholder="john@example.com"  onChange={(e) => SetEmail(e.target.value)} disabled />
                                    <span>Email không được phép thay đổi</span>
                                </div>
                            </div>
                            </>
                        )}
                        
                        </>
                    )}

                    {modalMode === "address" && (
                        <>
                        <h4 className="section-title">Personal address</h4>

                        <div className="grid grid-2 gap">
                            <div>
                                <label>Address</label>
                                <input name="address" type="text" value={addressValue} placeholder="Address" onChange={(e) =>{setAddressValue(e.target.value)}} />
                            </div>
                            <div>
                                <label>Ward</label>
                                <input name="Ward" type="text" value={wardValue}  placeholder="Ward" onChange={(e) =>{SetWardValue(e.target.value)}}/>
                            </div>
                            <div>
                                <label>Country</label>
                                <input name="Country" type="text" value={countryValue} placeholder="Country" onChange={(e) =>{SetCountryValue(e.target.value)}} />
                            </div>
                            <div>
                                <label>Phone</label>
                                <input name="Phone" type="number" value={phoneValue} placeholder="Phone" onChange={(e) =>{SetPhoneValue(e.target.value)}}/>
                            </div>
                            <div>
                                <label>City</label>
                                <input name="city" type="text" value={cityValue} placeholder="City" onChange={(e) =>{SetCityValue(e.target.value)}}/>
                            </div>
                        </div>
                        </>
                    )}

                    <div className="footer">
                    {modalMode === "avatar" && (
                        <button className="btn primary" type="button" onClick={handleSaveAvatar}>Save Changes avatar</button>
                    )}
                    {modalMode === "infor" && (
                        <button className="btn primary" type="button" onClick={handleSaveInfor}>Save Changes infor</button>
                    )}
                    {modalMode === "address" && (
                        addressList && addressList.length > 0 ?(
                            <button className="btn primary" type="button" onClick={handleUpAddress}>update</button>
                        ):(
                            <button className="btn primary" type="button" onClick={handleAddAddress}>add address</button>
                        )
                    )}
                    </div>
                </div>
            </div>
        )}
    </div>
    
)}


export default Profile;