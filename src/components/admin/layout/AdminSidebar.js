import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminSidebar.css";

const API = "http://localhost:8080/api/users";

const AdminSidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isActive = path =>
        location.pathname === path ? "nav-link active" : "nav-link";

    const handleLogout = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            await axios.post(`${API}/logout`, null, {
                params: { token }
            });

            localStorage.clear();
            navigate("/login");
        } catch (error) {
            console.error("Lỗi đăng xuất", error);
            localStorage.clear();
            navigate("/login");
        }
    };

    return (
        <div className="admin-sidebar d-flex flex-column p-3">
            <h4 className="text-center mb-4 sidebar-title">
                <i className="bi bi-speedometer2 me-2"></i>
                Trang quản trị
            </h4>

            <ul className="nav nav-pills flex-column">
                <li className="nav-item">
                    <Link to="/admin/users" className={isActive("/admin/users")}>
                        <i className="bi bi-people-fill me-2"></i>
                        Người dùng
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/admin/products" className={isActive("/admin/products")}>
                        <i className="bi bi-box-seam-fill me-2"></i>
                        Sản phẩm
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/admin/categories" className={isActive("/admin/categories")}>
                        <i className="bi bi-grid-fill me-2"></i>
                        Danh mục
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/admin/tags" className={isActive("/admin/tags")}>
                        <i className="bi bi-hash me-2"></i>
                        Tag
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/admin/banners" className={isActive("/admin/banners")}>
                        <i className="bi bi-image-fill me-2"></i>
                        Banner
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/admin/orders" className={isActive("/admin/orders")}>
                        <i className="bi bi-receipt me-2"></i>
                        Đơn hàng
                    </Link>
                </li>

                <li className="nav-item">
                    <Link to="/admin/statistics" className={isActive("/admin/statistics")}>
                        <i className="bi bi-bar-chart-line-fill me-2"></i>
                        Thống kê
                    </Link>
                </li>
            </ul>

            <div className="sidebar-footer">
                <hr />
                <button
                    onClick={handleLogout}
                    className="btn btn-outline-danger logout-btn"
                >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Đăng xuất
                </button>
            </div>
        </div>
    );
};

export default AdminSidebar;
