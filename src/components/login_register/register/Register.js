import React, { useState } from 'react';
import './Register.css';
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        sex: '',
        birthday: ''
    });
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        // tạo form-data
        const form = new FormData();
        // ❗ Gửi JSON dạng chuỗi text, không ép sang Blob
        form.append("data", JSON.stringify(formData));
        if (avatar) form.append("avatar", avatar);

        try {
            const res = await fetch("http://localhost:8080/api/users/register", {
                method: "POST",
                body: form
            });

            if (res.ok) {
                toast.success("🎉 Đăng ký thành công!");
                setTimeout(() => navigate("/login"), 1500);
            } else {
                const err = await res.json();
                toast.error(err.message || "Đăng ký thất bại!");
            }
        } catch (err) {
            console.error(err);
            toast.error("Không thể kết nối server!");
        }
    };

    return (
        <div className="register-container">
            <form className="register-form" onSubmit={handleRegister}>
                <div className="logo-register" onClick={() => navigate("/")}>
                    Sweet Dreams
                </div>

                <label>Ảnh đại diện</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                {preview && <img src={preview} alt="avatar" className="avatar-preview" />}

                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Họ và tên</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />

                <label>Số điện thoại</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} required />

                <label>Địa chỉ</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required />

                <label>Ngày sinh</label>
                <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} required />

                <label>Giới tính</label>
                <div className="gender-checkbox">
                    {["Nam", "Nữ", "Khác"].map((g) => (
                        <label key={g}>
                            <input type="radio" name="sex" value={g} checked={formData.sex === g} onChange={handleChange} />
                            {g}
                        </label>
                    ))}
                </div>

                <label>Mật khẩu</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required />

                <div className="button-submit">
                    <button type="submit" className="button-register">Đăng ký</button>
                </div>

                <ToastContainer position="top-right" autoClose={2000} />
            </form>
        </div>
    );
}
