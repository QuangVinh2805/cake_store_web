import React, { useState } from "react";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleForgotPassword = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.warning("Vui lòng nhập email");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch(
                `http://localhost:8080/api/users/forgot-password?email=${email}`,
                {
                    method: "POST",
                }
            );

            if (!res.ok) {
                const msg = await res.text();
                throw new Error(msg || "Email không tồn tại");
            }

            toast.success(
                "Mật khẩu mới đã được gửi về email. Vui lòng kiểm tra hộp thư!",
                {
                    position: "top-right",
                    autoClose: 8000,
                }
            );

            // quay lại trang login sau vài giây
            setTimeout(() => {
                navigate("/login");
            }, 8000);

        } catch (err) {
            toast.error(err.message || "Có lỗi xảy ra");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-container">
            <form className="forgot-form" onSubmit={handleForgotPassword}>
                <div className="logo-forgot" onClick={() => navigate("/")}>
                    Sweet Dreams
                </div>

                <h2>Quên mật khẩu</h2>
                <p className="forgot-desc">
                    Nhập email đã đăng ký để nhận mật khẩu mới
                </p>

                <label>Email</label>
                <input
                    type="email"
                    placeholder="Nhập email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <div className="button-submit">
                    <button type="submit" disabled={loading}>
                        {loading ? "Đang gửi..." : "Gửi mật khẩu mới"}
                    </button>
                </div>

                <div className="back-login">
                    <span onClick={() => navigate("/login")}>
                        ← Quay lại đăng nhập
                    </span>
                </div>
            </form>

            <ToastContainer />
        </div>
    );
}
