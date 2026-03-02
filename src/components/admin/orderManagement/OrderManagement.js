import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./OrderManagement.css";

const API = "http://localhost:8080/api/order";

const STATUS_STEPS = [
    { label: "Chuẩn bị", icon: "bi-box-seam" },
    { label: "Đang giao", icon: "bi-truck" },
    { label: "Đã giao", icon: "bi-check-circle-fill" },
    { label: "Đã hủy", icon: "bi-x-circle-fill" }
];

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(5);
    const [totalPages, setTotalPages] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("");
    const [isCheckout, setIsCheckout] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [mode, setMode] = useState("ALL");

    const fetchOrders = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/getAll`, {
                params: {
                    page: pageNumber,
                    size: size
                }
            });

            setOrders(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);

        } catch {
            toast.error("Không tải được danh sách đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(0);
    }, []);



    const searchOrders = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/search`, {
                params: {
                    keyword,
                    page: pageNumber,
                    size
                }
            });

            setOrders(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);
            setMode("SEARCH");

        } catch {
            toast.error("Search thất bại");
        } finally {
            setLoading(false);
        }
    };

    const filterByStatus = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/filter/status`, {
                params: {
                    status,
                    page: pageNumber,
                    size
                }
            });

            setOrders(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);
            setMode("STATUS");

        } finally {
            setLoading(false);
        }
    };

    const filterByCheckout = async (pageNumber = 0) => {
        setLoading(true);
        try {
            const res = await axios.get(`${API}/filter/checkout`, {
                params: {
                    isCheckout,
                    page: pageNumber,
                    size
                }
            });

            setOrders(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);
            setMode("CHECKOUT");

        } finally {
            setLoading(false);
        }
    };

    const filterByDate = async (pageNumber = 0) => {
        if (!fromDate || !toDate) {
            toast.warning("Chọn đủ ngày");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.get(`${API}/filter/date`, {
                params: {
                    from: fromDate,
                    to: toDate,
                    page: pageNumber,
                    size
                }
            });

            setOrders(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);
            setMode("DATE");

        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (mode === "SEARCH") searchOrders(newPage);
        else if (mode === "STATUS") filterByStatus(newPage);
        else if (mode === "CHECKOUT") filterByCheckout(newPage);
        else if (mode === "DATE") filterByDate(newPage);
        else fetchOrders(newPage);
    };



    const handleUpdateStatus = async (orderId, currentStatus) => {
        let nextStatus;
        if (currentStatus === 0) nextStatus = 1;
        else if (currentStatus === 1) nextStatus = 2;
        else return;

        // 🔥 toast loading
        const loadingToast = toast.loading(
            "Đang cập nhật trạng thái, vui lòng chờ..."
        );

        try {
            await axios.put(`${API}/updateStatus`, {
                orderId,
                status: nextStatus
            });

            setOrders(prev =>
                prev.map(o =>
                    o.orderId === orderId
                        ? {
                            ...o,
                            status: nextStatus,
                            isCheckout: nextStatus === 2 ? 1 : o.isCheckout
                        }
                        : o
                )
            );

            // ✅ update toast → success
            toast.update(loadingToast, {
                render: "Cập nhật trạng thái đơn hàng thành công",
                type: "success",
                isLoading: false,
                autoClose: 2000
            });

        } catch {
            // ❌ update toast → error
            toast.update(loadingToast, {
                render: "Cập nhật trạng thái thất bại",
                type: "error",
                isLoading: false,
                autoClose: 3000
            });
        }
    };


    /* ================= STATUS BAR ================= */
    const renderStatusBar = (status) => {
        return (
            <div className="order-status-bar mb-3">
                {STATUS_STEPS.map((step, index) => {
                    const isActive =
                        status === 3
                            ? index === 3
                            : index <= status && index !== 3;

                    const isCancel = status === 3 && index === 3;

                    return (
                        <div
                            key={index}
                            className={`status-step 
                                ${isActive ? "active" : ""} 
                                ${isCancel ? "cancel" : ""}`}
                        >
                            <div className="status-icon">
                                <i className={`bi ${step.icon}`}></i>
                            </div>
                            <span>{step.label}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <AdminLayout>
            <ToastContainer />

            <h2 className="mb-4">
                <i className="bi bi-receipt-cutoff me-2"></i>
                Order Management
            </h2>
            <div className="row mb-3 g-2">

                {/* SEARCH */}
                <div className="col-md-3">
                    <input
                        className="form-control"
                        placeholder="Email hoặc SĐT"
                        value={keyword}
                        onChange={e => setKeyword(e.target.value)}
                    />
                </div>

                <div className="col-md-1">
                    <button className="btn btn-primary w-100"
                            onClick={() => searchOrders(0)}>
                        Tìm kiếm
                    </button>
                </div>

                {/* STATUS */}
                <div className="col-md-2">
                    <select className="form-select"
                            value={status}
                            onChange={e => setStatus(e.target.value)}>
                        <option value="">-- Trạng thái --</option>
                        <option value="0">Chuẩn bị</option>
                        <option value="1">Đang giao</option>
                        <option value="2">Đã giao</option>
                        <option value="3">Đã hủy</option>
                    </select>
                </div>

                <div className="col-md-1">
                    <button className="btn btn-secondary w-100"
                            onClick={() => filterByStatus(0)}>
                        Lọc
                    </button>
                </div>

                {/* CHECKOUT */}
                <div className="col-md-2">
                    <select className="form-select"
                            value={isCheckout}
                            onChange={e => setIsCheckout(e.target.value)}>
                        <option value="">Thanh toán</option>
                        <option value="0">Chưa thanh toán</option>
                        <option value="1">Đã thanh toán</option>
                    </select>
                </div>

                <div className="col-md-1">
                    <button className="btn btn-secondary w-100"
                            onClick={() => filterByCheckout(0)}>
                        Lọc
                    </button>
                </div>

            </div>

            {/* DATE */}
            <div className="row mb-3 g-2">
                <div className="col-md-3">
                    <input type="date"
                           className="form-control"
                           value={fromDate}
                           onChange={e => setFromDate(e.target.value)} />
                </div>

                <div className="col-md-3">
                    <input type="date"
                           className="form-control"
                           value={toDate}
                           onChange={e => setToDate(e.target.value)} />
                </div>

                <div className="col-md-2">
                    <button className="btn btn-secondary w-100"
                            onClick={() => filterByDate(0)}>
                        Lọc theo ngày
                    </button>
                </div>

                <div className="col-md-2">
                    <button className="btn btn-outline-dark w-100"
                            onClick={() => {
                                setKeyword("");
                                setStatus("");
                                setIsCheckout("");
                                setFromDate("");
                                setToDate("");
                                setMode("ALL");
                                fetchOrders(0);
                            }}>
                        Reset
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : orders.length === 0 ? (
                <div className="text-center text-muted">Chưa có đơn hàng</div>
            ) : (
                orders.map(order => (
                    <div className="card shadow-sm mb-4" key={order.orderId}>
                        <div className="card-body">

                            {/* STATUS BAR */}
                            {renderStatusBar(order.status)}

                            {/* ORDER INFO */}
                            <div className="table-responsive">
                                <table className="table table-bordered align-middle">
                                    <thead className="table-light">
                                    <tr className="text-center">
                                        <th>Khách hàng</th>
                                        <th>Địa chỉ</th>
                                        <th>Email</th>
                                        <th>Số điện thoại</th>
                                        <th>Tổng tiền</th>
                                        <th>Thanh toán</th>
                                        <th>Cách thanh toán</th>
                                        <th>Ngày đặt</th>
                                        <th>Action</th>
                                    </tr>
                                    </thead>

                                    <tbody>
                                    <tr>
                                        <td>{order.userName}</td>
                                        <td>{order.address}</td>
                                        <td>{order.email}</td>
                                        <td>{order.phone}</td>
                                        <td className="text-danger fw-bold">
                                            {order.totalPrice.toLocaleString()} ₫
                                        </td>
                                        <td className="text-center">
                                            {order.isCheckout === 1 ? (
                                                <span className="badge bg-success">
                                                    <i className="bi bi-credit-card me-1"></i>
                                                    Đã thanh toán
                                                </span>
                                            ) : (
                                                <span className="badge bg-warning text-dark">
                                                    <i className="bi bi-hourglass-split me-1"></i>
                                                    Chưa thanh toán
                                                </span>
                                            )}
                                        </td>
                                        <td>{order.paymentMethod}</td>
                                        <td className="text-center">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-info me-1"
                                                title="Xem chi tiết"
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>
                                            {/* UPDATE STATUS */}
                                            {order.status < 2 && order.status !== 3 && (
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    title="Cập nhật trạng thái"
                                                    onClick={() =>
                                                        handleUpdateStatus(order.orderId, order.status)
                                                    }
                                                >
                                                    <i className="bi bi-arrow-repeat"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* ORDER DETAILS */}
                            <div className="mt-3">
                                <strong>Chi tiết sản phẩm:</strong>
                                <div className="row mt-2">
                                    {order.details.map((item, i) => (
                                        <div className="col-md-4 mb-2" key={i}>
                                            <div className="border rounded p-2 h-100">
                                                <div className="d-flex align-items-center">
                                                    <img
                                                        src={`http://localhost:8080${item.image}`}
                                                        alt=""
                                                        className="order-item-img me-2"
                                                    />
                                                    <div>
                                                        <div>Vị: {item.taste}</div>
                                                        <div>Số lượng: {item.quantity}</div>
                                                        <div className="text-danger">
                                                            {item.totalPrice.toLocaleString()} ₫
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                ))
            )}

            <nav>
                <ul className="pagination justify-content-center">

                    <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(page - 1)}
                        >
                            «
                        </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageChange(i)}
                            >
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => handlePageChange(page + 1)}
                        >
                            »
                        </button>
                    </li>

                </ul>
            </nav>

        </AdminLayout>
    );
};

export default OrderManagement;
