import React, { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        sex: "",
        birthday: ""
    });

    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
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

        const form = new FormData();
        form.append("data", JSON.stringify(formData));
        if (avatar) form.append("avatar", avatar);

        try {
            setLoading(true);

            const res = await fetch("http://localhost:8080/api/users/register", {
                method: "POST",
                body: form
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error("Đăng ký thật bại.Lý do " + result.message || "Đăng ký thất bại!");
                return;
            }

            toast.success("Đăng ký thành công! Mật khẩu đã được gửi qua email");
            setTimeout(() => navigate("/login"), 3000);

        } catch (error) {
            console.error(error);
            toast.error("Không thể kết nối tới server!");
        } finally {
            setLoading(false);
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
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label>Họ và tên</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label>Số điện thoại</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />

                <label>Địa chỉ</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />

                <label>Ngày sinh</label>
                <input
                    type="date"
                    name="birthday"
                    value={formData.birthday}
                    onChange={handleChange}
                    required
                />

                <label>Giới tính</label>
                <div className="gender-checkbox">
                    {["Nam", "Nữ", "Khác"].map(g => (
                        <label key={g}>
                            <input
                                type="radio"
                                name="sex"
                                value={g}
                                checked={formData.sex === g}
                                onChange={handleChange}
                                required
                            />
                            {g}
                        </label>
                    ))}
                </div>

                <div className="button-submit">
                    <button
                        type="submit"
                        className="button-register"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng ký..." : "Đăng ký"}
                    </button>
                </div>

                <ToastContainer position="top-right" autoClose={2000} />
            </form>
        </div>
    );
}
