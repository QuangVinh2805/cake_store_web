import React, { useContext, useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginForm() {
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const goToHome = () => {
        navigate(`/`);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            const res = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone,
                    password,
                }),
            });

            const data = await res.json(); // 👈 LUÔN đọc body

            if (!res.ok) {
                // 👇 Ưu tiên message BE trả về
                throw new Error(data.message || "Đăng nhập thất bại");
            }

            login(data);

            toast.success("Đăng nhập thành công!", {
                position: "top-right",
            });

            setTimeout(() => {
                if (data.role === "ADMIN") navigate("/admin/users");
                else navigate("/");
            }, 2000);

        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            setErrorMessage(error.message); // 👈 message từ BE
            toast.error(error.message);
        }
    };


    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleLogin}>
                <div className="logo-login" onClick={goToHome}>Sweet Dreams</div>

                <label>Số điện thoại</label>
                <input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />

                <label>Mật khẩu</label>
                <input
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {/* Hiển thị lỗi dưới ô mật khẩu */}
                {errorMessage && <p className="error-text">{errorMessage}</p>}

                <div className="button-submit">
                    <button type="submit" className="button-login">Đăng nhập</button>
                </div>

                <div className="register-link">
                    Chưa có tài khoản? <a href="/register">Đăng ký</a>
                </div>
                <div className="register-link">
                    <span
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate("/forgot-password")}
                    >
                        Quên mật khẩu?
                    </span>
                </div>


                <div className="deco">
                    <img className="deco1" src="./logologin1.png" alt="deco1" />
                    <img className="deco2" src="./logologin2.png" alt="deco2" />
                    <img className="deco3" src="./logologin3.png" alt="deco3" />
                    <img className="deco4" src="./logologin4.png" alt="deco4" />
                </div>
            </form>

            {/* Toast container */}
            <ToastContainer />
        </div>
    );
}
