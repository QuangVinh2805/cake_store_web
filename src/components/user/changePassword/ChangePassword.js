import React, {useState, useContext} from "react";
import "./ChangePassword.css";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {AuthContext} from "../../../context/AuthContext";
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default function ChangePassword() {
    const {user} = useContext(AuthContext);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setLoading(true);

        try {
            const token = user?.token; // lấy JWT token từ AuthContext
            if (!token) throw new Error("Không tìm thấy token. Vui lòng đăng nhập lại.");

            const res = await fetch(
                `http://localhost:8080/api/users/change-password?token=${token}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                    }),
                }
            );

            let data;

            if (!res.ok) {
                const message = data?.message || "Đổi mật khẩu thất bại!";
                throw new Error(message);
            }

            toast.success(data || "Đổi mật khẩu thành công!", {
                position: "top-right",
                autoClose: 2000,
            });


            setOldPassword("");
            setNewPassword("");
        } catch (error) {
            console.error("❌ Lỗi đổi mật khẩu:", error);
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-main">
            <Header/>
            <div className="change-password-container">
                <h2 className="change-password-text">Đổi mật khẩu</h2>
                <form className="change-password-form" onSubmit={handleChangePassword}>

                    <label>Mật khẩu cũ</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu cũ"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />

                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />

                    {errorMessage && <p className="error-text">{errorMessage}</p>}

                    <button type="submit" className="btn-change" disabled={loading}>
                        {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                    </button>
                </form>


                <ToastContainer/>
            </div>
            <Footer/>
        </div>
    );
}
