import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:8080/api/banners";
const BASE_URL = "http://localhost:8080";


const BannerManagement = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);

    const [form, setForm] = useState({
        productName: "",
        description: "",
        background: "",
        colorButton: ""
    });

    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    /* ================= LOAD ALL ================= */
    const fetchBanners = async (pageNumber = 0) => {
        try {
            const res = await axios.get(`${API}/getAllPaging`, {
                params: {
                    page: pageNumber,
                    size: 12
                }
            });

            setBanners(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);

        } catch (e) {
            toast.error("Không tải được banner");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners(0);
    }, []);


    /* ================= FILTER ================= */
    const filteredBanners = banners.filter(b =>
        b.productName?.toLowerCase().includes(search.toLowerCase())
    );

    /* ================= HANDLE FORM ================= */
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    /* ================= CREATE / UPDATE ================= */
    const handleSubmit = async () => {
        if (!form.productName.trim()) {
            toast.error("Tên sản phẩm không được để trống");
            return;
        }

        try {
            const formData = new FormData();

            formData.append(
                "data",
                JSON.stringify({
                    productName: form.productName,
                    description: form.description,
                    background: form.background,
                    colorButton: form.colorButton
                })
            );

            if (imageFile) {
                formData.append("image", imageFile);
            }

            let res;
            if (editingBanner) {
                // UPDATE
                res = await axios.put(
                    `${API}/update`,
                    formData,
                    {
                        params: { id: editingBanner.id },
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );

                setBanners(prev =>
                    prev.map(b => b.id === res.data.id ? res.data : b)
                );

                toast.success("Cập nhật banner thành công");
            } else {
                // CREATE
                res = await axios.post(
                    `${API}/create`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );

                setBanners(prev => [...prev, res.data]);
                toast.success("Thêm banner thành công");
            }

            closeModal();

        } catch (err) {
            toast.error(err.response?.data?.message || "Thao tác thất bại");
        }
    };

    /* ================= CHANGE STATUS ================= */
    const handleChangeStatus = async (id) => {
        try {
            await axios.put(`${API}/changeStatus`, null, { params: { id } });

            setBanners(prev =>
                prev.map(b =>
                    b.id === id
                        ? { ...b, status: b.status === 1 ? 0 : 1 }
                        : b
                )
            );

            toast.success("Đổi trạng thái thành công");
        } catch {
            toast.error("Đổi trạng thái thất bại");
        }
    };

    /* ================= MODAL ================= */
    const resetForm = () => {
        setForm({
            productName: "",
            description: "",
            background: "",
            colorButton: ""
        });
        setImageFile(null);
        setPreview(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBanner(null);
        resetForm();
    };

    const openCreateModal = () => {
        resetForm();
        setEditingBanner(null);
        setShowModal(true);
    };

    const openEditModal = (banner) => {
        setEditingBanner(banner);
        setForm({
            productName: banner.productName || "",
            description: banner.description || "",
            background: banner.background || "",
            colorButton: banner.colorButton || ""
        });
        setPreview(banner.image ? `${BASE_URL}${banner.image}` : null);
        setImageFile(null);
        setShowModal(true);
    };

    return (
        <AdminLayout>
            <ToastContainer />

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>
                    <i className="bi bi-images me-2"></i>
                    Banner Management
                </h2>

                <button className="btn btn-success" onClick={openCreateModal}>
                    <i className="bi bi-plus-circle me-1"></i>
                    Thêm banner
                </button>
            </div>

            {/* SEARCH */}
            <div className="mb-3">
                <input
                    className="form-control"
                    placeholder="Tìm theo tên sản phẩm..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* TABLE */}
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <table className="table table-bordered align-middle">
                    <thead className="table-dark text-center">
                    <tr>
                        <th>Ảnh</th>
                        <th>Sản phẩm</th>
                        <th>Trạng thái</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBanners.map(b => (
                        <tr key={b.id}>
                            <td className="text-center">
                                {b.image && (
                                    <img
                                        src={`${BASE_URL}${b.image}`}
                                        alt=""
                                        style={{ width: 80 }}
                                    />

                                )}
                            </td>
                            <td>{b.productName}</td>
                            <td className="text-center">
                                {b.status === 1
                                    ? <span className="badge bg-success">Hiện</span>
                                    : <span className="badge bg-secondary">Ẩn</span>
                                }
                            </td>
                            <td className="text-center">
                                <button className="btn btn-warning btn-sm me-1" onClick={() => openEditModal(b)}>
                                    <i className="bi bi-pencil-square"></i>
                                </button>
                                <button
                                    className={`btn btn-sm ${b.status === 1 ? "btn-success" : "btn-danger"}`}
                                    onClick={() => handleChangeStatus(b.id)}
                                >
                                    <i className={`bi ${b.status === 1 ? "bi-unlock-fill" : "bi-lock-fill"}`}></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            <nav>
                <ul className="pagination justify-content-center mt-3">
                    <li className={`page-item ${page === 0 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(page - 1)}>
                            «
                        </button>
                    </li>

                    {[...Array(totalPages)].map((_, i) => (
                        <li key={i} className={`page-item ${page === i ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setPage(i)}>
                                {i + 1}
                            </button>
                        </li>
                    ))}

                    <li className={`page-item ${page === totalPages - 1 ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setPage(page + 1)}>
                            »
                        </button>
                    </li>
                </ul>
            </nav>

            {/* MODAL */}
            {showModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>{editingBanner ? "Cập nhật banner" : "Thêm banner"}</h5>
                                <button className="btn-close" onClick={closeModal} />
                            </div>

                            <div className="modal-body">
                                <input className="form-control mb-2" name="productName" placeholder="Tên sản phẩm" value={form.productName} onChange={handleChange} />
                                <textarea className="form-control mb-2" name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />
                                <input className="form-control mb-2" name="background" placeholder="Màu nền" value={form.background} onChange={handleChange} />
                                <input className="form-control mb-2" name="colorButton" placeholder="Màu nút" value={form.colorButton} onChange={handleChange} />

                                <input type="file" className="form-control mb-2" onChange={handleImageChange} />

                                {preview && (
                                    <img src={preview} alt="" style={{ width: 120 }} />
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={closeModal}>Hủy</button>
                                <button className="btn btn-success" onClick={handleSubmit}>Lưu</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default BannerManagement;
