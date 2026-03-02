import React, { useEffect, useState } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import axios from "axios";
import "./OrderDetail.css";
import ReactDOM from "react-dom";


export default function OrderDetail() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);



    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                "http://localhost:8080/api/order/myOrders",
                {
                    params: {
                        token,
                        page,
                        size
                    }
                }
            );

            setOrders(res.data.content);
            setTotalPages(res.data.totalPages);

        } catch (err) {
            console.error("Load orders error", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [page]);



    const renderStatus = (status) => {
        switch (status) {
            case 0: return <span className="status preparing">Đang chuẩn bị</span>;
            case 1: return <span className="status shipping">Đang giao</span>;
            case 2: return <span className="status success">Đã giao</span>;
            case 3: return <span className="status cancel-order">Đã hủy</span>;
            default: return "";
        }
    };

    const openCancelModal = (orderId) => {
        setSelectedOrderId(orderId);
        setShowCancelModal(true);
    };


    const confirmCancelOrder = async () => {
        console.log("Nút đã được bấm!"); // Thêm dòng này
        console.log("ID đơn hàng đang chọn:", selectedOrderId); // Kiểm tra ID

        if (!selectedOrderId) {
            console.error("Lỗi: selectedOrderId đang bị null hoặc undefined");
            return;
        }
        try {
            setCancelLoading(true);

            await axios.put("http://localhost:8080/api/order/updateStatus", {
                orderId: selectedOrderId,
                status: 3 // ❌ Đã hủy
            });

            // cập nhật UI
            setOrders(prev =>
                prev.map(order =>
                    order.orderId === selectedOrderId
                        ? { ...order, status: 3 }
                        : order
                )
            );

            setShowCancelModal(false);
            setSelectedOrderId(null);

        } catch (error) {
            console.error("Hủy đơn thất bại", error);
            alert("Không thể hủy đơn hàng!");
        } finally {
            setCancelLoading(false);
        }
    };


    const renderIsCheckout = (isCheckout) => {
        switch (isCheckout) {
            case 0: return <span className="is_checkout noCheckout">Chưa thanh toán</span>;
            case 1: return <span className="is_checkout checkout">Đã thanh toán</span>;
            default: return "";
        }
    };

    if (loading) return <div className="loading">Đang tải đơn hàng...</div>;

    return (
        <>
            <Header />

            <div className="order-detail-page">
                <h2 className="order-title">Đơn hàng của tôi</h2>

                {orders.length === 0 ? (
                    <p className="empty">Bạn chưa có đơn hàng nào</p>
                ) : (
                    orders.map((order, index) => (
                        <div key={index} className="order-card">

                            <div className="order-header">
                                <div>
                                    <strong>Người đặt:</strong> {order.userName}
                                </div>
                                <div>Trạng thái : {renderStatus(order.status)}</div>
                                {renderIsCheckout(order.isCheckout)}
                                <div>Cách thanh toán : {order.paymentMethod}</div>
                            </div>

                            <div className="order-info">
                                <div>
                                    <strong>Địa chỉ:</strong> {order.address}
                                </div>
                                <div>
                                    <strong>Ngày đặt:</strong>{" "}
                                    {new Date(order.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <table className="order-table">
                                <thead>
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Vị bánh</th>
                                    <th>Số lượng</th>
                                    <th>Tổng tiền</th>
                                </tr>
                                </thead>
                                <tbody>
                                {order.details.map((item, idx) => (
                                    <tr key={idx}>
                                        <td><img
                                            src={`http://localhost:8080${item.image}`}
                                            alt={item.taste}
                                            className="order-item-img-product"
                                        />
                                        </td>
                                        <td>{item.taste}</td>
                                        <td>{item.quantity}</td>
                                        <td>
                                            {item.totalPrice.toLocaleString()} ₫
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>

                            {order.status === 0 && (
                                <div className="order-actions">
                                    <button
                                        className="btn-cancel-order"
                                        onClick={() =>{
                                            console.log("Mở modal cho đơn hàng:", order.orderId);
                                            openCancelModal(order.orderId);}}
                                    >
                                        Hủy đơn
                                    </button>
                                </div>
                            )}

                            <div className="order-total">
                                Tổng tiền:{" "}
                                <span>
                                    {order.totalPrice.toLocaleString()} ₫
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        disabled={page === 0}
                        onClick={() => setPage(page - 1)}
                    >
                        ‹ Trước
                    </button>

                    <span>
            Trang {page + 1} / {totalPages}
        </span>

                    <button
                        disabled={page === totalPages - 1}
                        onClick={() => setPage(page + 1)}
                    >
                        Sau ›
                    </button>
                </div>
            )}



            {showCancelModal &&
                ReactDOM.createPortal(
                    <div className="modal-overlay">
                        <div
                            className="modal-content-order"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>Xác nhận hủy đơn</h3>
                            <p>Bạn có chắc chắn muốn hủy đơn hàng này không?</p>

                            <div className="modal-actions">
                                <button
                                    className="btn-secondary"
                                    onClick={() => setShowCancelModal(false)}
                                    disabled={cancelLoading}
                                >
                                    Không
                                </button>

                                <button
                                    className="btn-cancel-order"
                                    onClick={confirmCancelOrder}
                                    disabled={cancelLoading}
                                >
                                    {cancelLoading ? "Đang hủy..." : "Xác nhận hủy"}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById("modal-root")
                )
            }



            <Footer disablePointer={showCancelModal} />
        </>
    );
}
