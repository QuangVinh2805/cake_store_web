import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import { Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend
);

const API = "http://localhost:8080/api/order";

const Statistics = () => {
    const [revenueData, setRevenueData] = useState([]);
    const [orderStatusByMonth, setOrderStatusByMonth] = useState([]);
    const [orderSummary, setOrderSummary] = useState(null);

    /* ================= FETCH DATA ================= */
    useEffect(() => {
        fetchRevenueByMonth();
        fetchOrderStatusByMonth();
        fetchOrderSummary();
    }, []);

    const fetchRevenueByMonth = async () => {
        const res = await axios.get(`${API}/revenue-by-month`);
        setRevenueData(res.data);
    };

    const fetchOrderStatusByMonth = async () => {
        const res = await axios.get(`${API}/order-status-by-month`);
        setOrderStatusByMonth(res.data);
    };

    const fetchOrderSummary = async () => {
        const res = await axios.get(`${API}/order-status-summary`);
        setOrderSummary(res.data);
    };

    /* ================= CHART DATA ================= */

    /* ===== BAR: DOANH THU ===== */
    const revenueBarData = {
        labels: revenueData.map(i => `${i.month}/${i.year}`),
        datasets: [
            {
                label: "Doanh thu (₫)",
                data: revenueData.map(i => i.totalRevenue),
                backgroundColor: "#0d6efd"
            }
        ]
    };

    /* ===== BAR: ĐƠN GIAO & HUỶ ===== */
    const orderStatusBarData = {
        labels: orderStatusByMonth.map(i => `${i.month}/${i.year}`),
        datasets: [
            {
                label: "Đã giao",
                data: orderStatusByMonth.map(i => i.deliveredOrders),
                backgroundColor: "#198754"
            },
            {
                label: "Đã huỷ",
                data: orderStatusByMonth.map(i => i.canceledOrders),
                backgroundColor: "#dc3545"
            }
        ]
    };

    /* ===== PIE: TỔNG ĐƠN ===== */
    const pieData = orderSummary && {
        labels: ["Đã giao", "Đã huỷ"],
        datasets: [
            {
                data: [
                    orderSummary.deliveredOrders,
                    orderSummary.canceledOrders
                ],
                backgroundColor: ["#198754", "#dc3545"]
            }
        ]
    };

    return (
        <AdminLayout>
            <h2 className="mb-4">
                <i className="bi bi-bar-chart-fill me-2"></i>
                Statistics
            </h2>

            {/* ===== DOANH THU THEO THÁNG ===== */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="mb-3">Doanh thu theo tháng</h5>
                    {revenueData.length === 0 ? (
                        <p className="text-muted text-center">Chưa có dữ liệu</p>
                    ) : (
                        <Bar data={revenueBarData} />
                    )}
                </div>
            </div>

            {/* ===== ĐƠN GIAO & HUỶ THEO THÁNG ===== */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h5 className="mb-3">Đơn hàng theo tháng</h5>
                    {orderStatusByMonth.length === 0 ? (
                        <p className="text-muted text-center">Chưa có dữ liệu</p>
                    ) : (
                        <Bar data={orderStatusBarData} />
                    )}
                </div>
            </div>

            {/* ===== TỔNG ĐƠN (PIE) ===== */}
            {orderSummary && (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="mb-3 text-center">Tổng đơn hàng</h5>
                        <div style={{ maxWidth: 400, margin: "0 auto" }}>
                            <Pie data={pieData} />
                        </div>

                        <div className="text-center mt-3">
                            <strong>Tổng:</strong>{" "}
                            {orderSummary.totalOrders}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default Statistics;
