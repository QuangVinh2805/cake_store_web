import React, { useEffect, useState } from 'react';
import './CheckOut.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Checkout() {
    const [userInfo, setUserInfo] = useState(null);


    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        note: ''
    });

    const [cartItems, setCartItems] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    /* ================= GET CART ================= */
    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (!token) {
                    toast.warning("Bạn chưa đăng nhập");
                    return;
                }

                const res = await axios.get(
                    "http://localhost:8080/api/cart/getCartByToken",
                    { params: { token } }
                );

                setCartItems(res.data);
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    error?.response?.data ||
                    "Không thể tải giỏ hàng"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [token]);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                if (!token) return;

                const res = await axios.get(
                    "http://localhost:8080/api/users/getInfo",
                    { params: { token } }
                );

                setUserInfo(res.data);
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    "Không thể lấy thông tin người dùng"
                );
            }
        };

        fetchUserInfo();
    }, [token]);


    const totalPrice = cartItems.reduce(
        (total, item) => total + item.totalPrice,
        0
    );

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            toast.warning("Giỏ hàng trống");
            return;
        }

        console.log("Thông tin đơn hàng:", {
            customer: formData,
            items: cartItems,
            totalPrice
        });

        toast.success("Đặt hàng thành công!");
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.warning("Giỏ hàng trống");
            return;
        }

        try {
            // 1️⃣ tạo order (checkout)
            const checkoutRes = await axios.post(
                "http://localhost:8080/api/order/checkout",
                {
                    token: token,
                    address: userInfo.address
                }
            );

            // backend NÊN trả về orderId
            const orderId = checkoutRes.data?.orderId;

            // 2️⃣ nếu COD
            if (paymentMethod === "COD") {
                toast.success("Đặt hàng thành công!");
                window.location.href = "/my-orders";
                return;
            }

            // 3️⃣ nếu VNPAY
            const vnpayRes = await axios.post(
                "http://localhost:8080/api/order/vnpay/create",
                { orderId },
                { params: { token } }
            );

            window.location.href = vnpayRes.data.paymentUrl;

        } catch (err) {
            toast.error(
                err?.response?.data?.message ||
                "Thanh toán thất bại"
            );
        }
    };

    if (loading) return <div>Đang tải dữ liệu...</div>;

    return (
        <div className="checkout-main">
            <Header />
            <ToastContainer position="top-right" autoClose={2500} />

            <div className="checkout-container">
                {/* ================= LEFT ================= */}
                <div className="checkout-left">
                    <h2>Thông tin giao hàng</h2>

                    {!userInfo ? (
                        <p>Đang tải thông tin người dùng...</p>
                    ) : (
                        <form className="checkout-form" onSubmit={handleSubmit}>

                            <label>Họ và tên</label>
                            <input
                                type="text"
                                value={userInfo.name || ""}
                                disabled
                            />

                            <label>Email</label>
                            <input
                                type="email"
                                value={userInfo.email || ""}
                                disabled
                            />

                            <label>Số điện thoại</label>
                            <input
                                type="tel"
                                value={userInfo.phone || ""}
                                disabled
                            />

                            <label>Địa chỉ giao hàng</label>
                            <input
                                type="text"
                                value={userInfo.address || ""}
                                disabled
                            />

                        </form>
                    )}
                </div>


                {/* ================= RIGHT ================= */}
                <div className="checkout-right">
                    <h3>Đơn hàng của bạn</h3>

                    {cartItems.length === 0 ? (
                        <p>Giỏ hàng trống</p>
                    ) : (
                        cartItems.map(item => (
                            <div
                                key={item.productTasteId}
                                className="checkout-item"
                            >
                                <img
                                    src={`http://localhost:8080${item.image}`}
                                    alt={item.productName}
                                />
                                <div>
                                    <p className="item-name">
                                        {item.productName}
                                    </p>
                                    <p className="item-quantity">
                                        x{item.quantity}
                                    </p>
                                    <p className="item-price">
                                        {item.totalPrice.toLocaleString()}đ
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                    <div className="payment-method">
                        <h4>Phương thức thanh toán</h4>

                        <label>
                            <input
                                type="radio"
                                checked={paymentMethod === "COD"}
                                onChange={() => setPaymentMethod("COD")}
                            />
                            Thanh toán khi nhận hàng
                        </label>

                        <label>
                            <input
                                type="radio"
                                checked={paymentMethod === "VNPAY"}
                                onChange={() => setPaymentMethod("VNPAY")}
                            />
                            Thanh toán VNPay
                        </label>
                    </div>

                    <div className="checkout-summary">
                        <strong>
                            Tổng cộng: {totalPrice.toLocaleString()}đ
                        </strong>

                        <button
                            type="submit"
                            className="checkout-submit"
                            onClick={handleCheckout}
                        >
                            Xác nhận đặt hàng
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
