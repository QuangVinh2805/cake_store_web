import React, { useEffect, useState, useContext } from 'react';
import { MdEmail, MdPhone, MdAccessTime } from 'react-icons/md';
import { FiShoppingCart, FiUser, FiShoppingBag, FiLogOut ,FiKey} from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext"; // 👈 thêm dòng này
import './ContactBar.css';

const ContactBar = () => {
    const navigate = useNavigate();
    const { user, setUser } = useContext(AuthContext); // 👈 lấy user từ context
    const [showDropdown, setShowDropdown] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    const avatarUrl = user?.avatar
        ? (user.avatar.startsWith("http") ? user.avatar : `http://localhost:8080${user.avatar}`)
        : null;

    const goToCart = () => navigate(`/cart`);

    const toggleDropdown = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate(`/login`);
            return;
        }

        if (showDropdown) {
            setShowDropdown(false);
            setTimeout(() => setIsVisible(false), 200);
        } else {
            setIsVisible(true);
            setTimeout(() => setShowDropdown(true), 10);
        }
    };


    const handleProfile = () => {
        navigate(`/profile`);
        setShowDropdown(false);
        setIsVisible(false);
    };

    const handleChangePassword = () => {
        navigate(`/change-password`);
        setShowDropdown(false);
        setIsVisible(false);
    };

    const handleOrder = () => {
        navigate(`/my-orders`);
        setShowDropdown(false);
        setIsVisible(false);
    };
    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const res = await fetch(`http://localhost:8080/api/users/logout?token=${token}`, {
                method: "POST",
            });

            if (res.ok) {
                console.log("Đăng xuất thành công!");
            } else {
                console.error("Lỗi khi đăng xuất:", res.status);
            }
        } catch (error) {
            console.error("Lỗi kết nối khi logout:", error);
        }

        // 🔹 Dù backend có lỗi thì vẫn xóa token phía client để an toàn
        localStorage.removeItem("token");
        localStorage.removeItem("avatar");
        setUser(null);
        setShowDropdown(false);
        setIsVisible(false);
        navigate("/");
    };


    return (
        <div className="contact-bar">
            <div className="contact-left">
                <span><MdPhone /> 0352 988 201</span>
                <span><MdEmail /> sweetdreams@gmail.com</span>
                <span><MdAccessTime /> 6:00 - 22:00</span>
            </div>

            <div className="contact-right">
                <button className="order-btn" onClick={() => navigate("/product")} >
                    Đặt hàng ngay
                </button>
                <FiShoppingCart className="cart-icon" onClick={goToCart} />

                <div className="user-section" onClick={toggleDropdown}>
                    {avatarUrl ? (
                        <img
                            src={avatarUrl}
                            alt="avatar"
                            className="user-avatar"
                            onError={(e) => (e.target.src = "/default-avatar.png")}
                        />
                    ) : (
                        <FiUser className="user-icon" />
                    )}

                    {isVisible && (
                        <div className={`user-dropdown ${showDropdown ? 'show' : 'hide'}`}>
                            <div className="dropdown-item-user" onClick={handleProfile}>
                                <FiUser className="dropdown-icon"/>
                                <span>Thông tin cá nhân</span>
                            </div>
                            <div className="dropdown-item-user" onClick={handleChangePassword}>
                                <FiKey className="dropdown-icon"/>
                                <span>Thay đổi mật khẩu</span>
                            </div>
                            <div className="dropdown-item-user" onClick={handleOrder}>
                                <FiShoppingBag className="dropdown-icon"/>
                                <span>Đơn hàng của bạn</span>
                            </div>
                            <div className="dropdown-item-user" onClick={handleLogout}>
                                <FiLogOut className="dropdown-icon"/>
                                <span>Đăng xuất</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactBar;
