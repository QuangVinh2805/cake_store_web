import React, { createContext, useState, useEffect } from "react";

// Tạo Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // thông tin chi tiết user
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [role, setRole] = useState(localStorage.getItem("role") || null);
    const [avatar, setAvatar] = useState(localStorage.getItem("avatar") || null);

    // Khi token thay đổi → tự gọi API lấy thông tin user
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/api/users/getInfo?token=${token}`);
                if (!res.ok) throw new Error("Không thể lấy thông tin người dùng");

                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error("❌ Lỗi khi lấy user info:", err);
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("avatar");
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [token]);

    // Đăng nhập
    const login = (data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("avatar", data.avatar);

        setToken(data.token);
        setRole(data.role);
        setAvatar(data.avatar);
    };

    // Đăng xuất
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("avatar");

        setToken(null);
        setRole(null);
        setAvatar(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                role,
                avatar,
                login,
                logout,
                loading,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
