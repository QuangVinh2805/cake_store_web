import React, { useEffect, useState } from 'react';
import './Cart.css';
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { FiTrash2 } from 'react-icons/fi';
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";


export default function Cart() {

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleteType, setDeleteType] = useState(null);
    const navigate = useNavigate();


    const [selectedTasteId, setSelectedTasteId] = useState(null);


    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

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

    useEffect(() => {
        fetchCart();
    }, [token]);

    const updateQuantity = async (productTasteId, newQuantity) => {

        // 👉 nếu giảm về 0 thì xóa luôn
        if (newQuantity === 0) {
            setDeleteType("ONE");
            setSelectedTasteId(productTasteId);
            setShowConfirm(true);
            return;
        }


        if (newQuantity < 0) return;

        try {
            await axios.put(
                `http://localhost:8080/api/cart/update/${productTasteId}`,
                { quantity: newQuantity },
                { params: { token } }
            );

            // cập nhật UI local
            setCartItems(prev =>
                prev.map(item =>
                    item.productTasteId === productTasteId
                        ? {
                            ...item,
                            quantity: newQuantity,
                            totalPrice: newQuantity * item.unitPrice
                        }
                        : item
                )
            );

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Cập nhật số lượng thất bại"
            );
        }
    };


    /* ================= DELETE ONE ITEM ================= */
    // const deleteItem = async (productTasteId) => {
    //     try {
    //         await axios.delete(
    //             `http://localhost:8080/api/cart/delete/${productTasteId}`,
    //             { params: { token } }
    //         );
    //
    //         setCartItems(prev =>
    //             prev.filter(item => item.productTasteId !== productTasteId)
    //         );
    //
    //         toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    //
    //     } catch (error) {
    //         toast.error(
    //             error?.response?.data?.message ||
    //             error?.response?.data ||
    //             "Xóa sản phẩm thất bại"
    //         );
    //     }
    // };

    /* ================= DELETE ALL ================= */
    // const deleteAllCart = async () => {
    //     try {
    //         await axios.delete(
    //             "http://localhost:8080/api/cart/delete-all",
    //             { params: { token } }
    //         );
    //
    //         setCartItems([]);
    //         toast.success("Đã xóa toàn bộ giỏ hàng");
    //
    //     } catch (error) {
    //         toast.error(
    //             error?.response?.data?.message ||
    //             error?.response?.data ||
    //             "Xóa giỏ hàng thất bại"
    //         );
    //     }
    // };

    const handleConfirmDelete = async () => {
        try {
            if (deleteType === "ONE") {
                await axios.delete(
                    `http://localhost:8080/api/cart/delete/${selectedTasteId}`,
                    { params: { token } }
                );

                setCartItems(prev =>
                    prev.filter(item => item.productTasteId !== selectedTasteId)
                );

                toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
            }

            if (deleteType === "ALL") {
                await axios.delete(
                    "http://localhost:8080/api/cart/delete-all",
                    { params: { token } }
                );

                setCartItems([]);
                toast.success("Đã xóa toàn bộ giỏ hàng");
            }

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Thao tác thất bại"
            );
        } finally {
            setShowConfirm(false);
            setDeleteType(null);
            setSelectedTasteId(null);
        }
    };


    if (loading) return <div>Đang tải giỏ hàng...</div>;

    /* ================= TÍNH TỔNG ================= */
    const totalPrice = cartItems.reduce(
        (total, item) => total + item.totalPrice,
        0
    );

    return (
        <div className="cart-main">
            <Header />
            <ToastContainer position="top-right" autoClose={2500} />
            <hr width="100%" />

            <div className="cart-container">
                <h2>Giỏ hàng của bạn</h2>

                {cartItems.length === 0 ? (
                    <p>Giỏ hàng đang trống.</p>
                ) : (
                    <>
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <img
                                    src={`http://localhost:8080${item.image}`}
                                    alt={item.productName}
                                />

                                <div className="cart-item-info">
                                    <div className="cart-item-header">
                                        <h3>{item.productName}</h3>

                                        <button
                                            className="remove-button"
                                            onClick={() => {
                                                setDeleteType("ONE");
                                                setSelectedTasteId(item.productTasteId);
                                                setShowConfirm(true);
                                            }}
                                        >
                                            <FiTrash2 size={20} />
                                        </button>
                                    </div>

                                    <p>
                                        Giá: {item.unitPrice.toLocaleString()}đ
                                    </p>

                                    <div className="quantity-control">
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productTasteId,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.productTasteId,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="cart-summary">
                            <h3>
                                Tổng cộng: {totalPrice.toLocaleString()}đ
                            </h3>

                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    className="checkout-button"
                                    onClick={() => navigate("/checkout")}
                                >
                                    Thanh toán
                                </button>


                                <button
                                    className="checkout-button"
                                    style={{ background: "#ccc", color: "#000" }}
                                    onClick={() => {
                                        setDeleteType("ALL");
                                        setShowConfirm(true);
                                    }}
                                >
                                    Xóa toàn bộ
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <Footer />
            {showConfirm && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>Xác nhận</h3>

                        <p>
                            {deleteType === "ALL"
                                ? "Bạn có chắc muốn xóa toàn bộ giỏ hàng?"
                                : "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?"}
                        </p>

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowConfirm(false)}
                            >
                                Hủy
                            </button>

                            <button
                                className="btn-confirm"
                                onClick={handleConfirmDelete}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
