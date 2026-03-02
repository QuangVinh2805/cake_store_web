import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Profile.css";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { AuthContext } from "../../../context/AuthContext";

export default function Profile() {
    const { user, setUser, loading } = useContext(AuthContext); // 👈 lấy setUser thêm vào đây
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({});
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

    const validateForm = () => {
        if (!form.name.trim()) {
            return "Họ và tên không được để trống";
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            return "Email không hợp lệ";
        }

        if (form.phone && !/^[0-9]{9,11}$/.test(form.phone)) {
            return "Số điện thoại không hợp lệ";
        }

        if (form.birthday) {
            const birthday = new Date(form.birthday);
            const today = new Date();
            if (birthday > today) {
                return "Ngày sinh không hợp lệ";
            }
        }

        return null;
    };


    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                email: user.email || "",
                phone: user.phone || "",
                address: user.address || "",
                sex: user.sex || "",
                birthday: user.birthday ? user.birthday.split("T")[0] : "",
            });
            setPreview(
                user.avatar?.startsWith("http")
                    ? user.avatar
                    : `http://localhost:8080${user.avatar || ""}`
            );
        }
    }, [user]);

    if (loading) return <p>Đang tải thông tin...</p>;
    if (!user) {
        toast.error("Vui lòng đăng nhập trước!");
        navigate("/login");
        return null;
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ FE VALIDATE
        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập lại!");
            return;
        }

        const formData = new FormData();
        formData.append("token", token);
        formData.append("data", JSON.stringify(form));
        if (avatar) formData.append("avatar", avatar);

        try {
            const res = await fetch("http://localhost:8080/api/users/update", {
                method: "PUT",
                body: formData,
            });

            const result = await res.json();

            // ❌ BE TRẢ LỖI
            if (!res.ok) {
                toast.error("Cập nhật thất bại.Lý do " + result.message || "Cập nhật thất bại!",{autoClose: 10000});
                return;
            }

            // ✅ THÀNH CÔNG
            toast.success("Cập nhật thành công!",{autoClose: 10000});

            localStorage.setItem("userInfo", JSON.stringify(result));
            setUser(result);
            localStorage.setItem("avatar", result.avatar || "");

            setIsEditing(false);
            window.scrollTo({ top: 0, behavior: "smooth" });

        } catch (err) {
            console.error(err);
            toast.error("Không thể kết nối tới máy chủ!");
        }
    };

    return (
        <div className="profile-main">
            <Header />
            <ToastContainer position="top-right" autoClose={2000} />
            <h2 className="info-user">Thông tin cá nhân</h2>

            <div className="profile-container grid-layout">
                <div className="profile-info">
                    {!isEditing ? (
                        <>
                            <p><strong>Họ và tên:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            <p><strong>Số điện thoại:</strong> {user.phone}</p>
                            <p><strong>Địa chỉ:</strong> {user.address}</p>
                            <p><strong>Giới tính:</strong> {user.sex}</p>
                            <p>
                                <strong>Ngày sinh:</strong>{" "}
                                {user.birthday
                                    ? new Date(user.birthday).toLocaleDateString("vi-VN")
                                    : "—"}
                            </p>
                            <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                Chỉnh sửa thông tin
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit} className="edit-form">
                            <label>Họ và tên</label>
                            <input name="name" value={form.name} onChange={handleChange} required />

                            <label>Email</label>
                            <input type="email" name="email" value={form.email} onChange={handleChange} required />

                            <label>Số điện thoại</label>
                            <input name="phone" value={form.phone} onChange={handleChange} />

                            <label>Địa chỉ</label>
                            <input name="address" value={form.address} onChange={handleChange} />

                            <label>Giới tính</label>
                            <select name="sex" value={form.sex} onChange={handleChange}>
                                <option value="">Chọn</option>
                                <option value="Nam">Nam</option>
                                <option value="Nữ">Nữ</option>
                                <option value="Khác">Khác</option>
                            </select>

                            <label>Ngày sinh</label>
                            <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />

                            <label>Ảnh đại diện</label>
                            <input type="file" accept="image/*" onChange={handleAvatarChange} />
                            {preview && <img src={preview} alt="Avatar preview" className="avatar-preview" />}

                            <div className="form-btns">
                                <button type="submit" className="save-btn">Lưu thay đổi</button>
                                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Hủy</button>
                            </div>
                        </form>
                    )}
                </div>

                <div className="profile-avatar">
                    <img
                        src={
                            preview ||
                            (user.avatar?.startsWith("http")
                                ? user.avatar
                                : `http://localhost:8080${user.avatar}`)
                        }
                        alt="Avatar người dùng"
                        onError={(e) => (e.target.src = "/default-avatar.png")}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}
