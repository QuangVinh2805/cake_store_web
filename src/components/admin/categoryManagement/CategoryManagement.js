import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:8080/api/categories";

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [name, setName] = useState("");

    /* ================== LOAD ALL ================== */
    const fetchCategories = async (pageNumber = 0) => {
        try {
            const res = await axios.get(`${API}/getAllPaging`, {
                params: {
                    page: pageNumber,
                    size: 12
                }
            });

            setCategories(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);

        } catch (e) {
            toast.error("Không tải được danh mục");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(0);
    }, []);


    /* ================== FILTER ================== */
    const filteredCategories = categories.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase())
    );

    /* ================== CREATE / UPDATE ================== */
    const handleSubmit = async () => {
        if (!name.trim()) {
            toast.error("Tên danh mục không được để trống");
            return;
        }

        try {
            if (editingCategory) {
                // UPDATE
                const res = await axios.put(
                    `${API}/update`,
                    { name },
                    { params: { id: editingCategory.id } }
                );

                setCategories(prev =>
                    prev.map(c => c.id === res.data.id ? res.data : c)
                );

                toast.success("Cập nhật danh mục thành công");
            } else {
                // CREATE
                const res = await axios.post(`${API}/create`, { name });

                setCategories(prev => [...prev, res.data]);
                toast.success("Thêm danh mục thành công");
            }

            setShowModal(false);
            setName("");
            setEditingCategory(null);

        } catch (err) {
            toast.error(err.response?.data?.message || "Thao tác thất bại");
        }
    };

    /* ================== CHANGE STATUS ================== */
    const handleChangeStatus = async (id) => {
        try {
            await axios.put(`${API}/changeStatus`, null, { params: { id } });

            setCategories(prev =>
                prev.map(c =>
                    c.id === id
                        ? { ...c, status: c.status === 1 ? 0 : 1 }
                        : c
                )
            );

            toast.success("Đổi trạng thái thành công");
        } catch {
            toast.error("Đổi trạng thái thất bại");
        }
    };

    /* ================== OPEN MODALS ================== */
    const openCreateModal = () => {
        setEditingCategory(null);
        setName("");
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setEditingCategory(category);
        setName(category.name);
        setShowModal(true);
    };

    return (
        <AdminLayout>
            <ToastContainer />

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>
                    <i className="bi bi-tags-fill me-2"></i>
                    Category Management
                </h2>

                <button className="btn btn-success" onClick={openCreateModal}>
                    <i className="bi bi-plus-circle me-1"></i>
                    Thêm danh mục
                </button>
            </div>

            {/* Search */}
            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm theo tên danh mục..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                <div className="card shadow-sm">
                    <div className="card-body">
                        <table className="table table-bordered table-hover align-middle">
                            <thead className="table-dark">
                            <tr className="text-center">
                                <th>Tên danh mục</th>
                                <th>Trạng thái</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">
                                        Không tìm thấy danh mục
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map(c => (
                                    <tr key={c.id}>
                                        <td>{c.name}</td>

                                        <td className="text-center">
                                            {c.status === 1 ? (
                                                <span className="badge bg-success">Hoạt động</span>
                                            ) : (
                                                <span className="badge bg-secondary">Ẩn</span>
                                            )}
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-warning me-1"
                                                title="Cập nhật"
                                                onClick={() => openEditModal(c)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>

                                            <button
                                                className={`btn btn-sm ${c.status === 0 ? "btn-danger" : "btn-success"}`}
                                                title={c.status === 0 ? "Khóa" : "Mở"}
                                                onClick={() => handleChangeStatus(c.id)}
                                            >
                                                <i className={`bi ${c.status === 0 ? "bi-lock-fill" : "bi-unlock-fill"}`}></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
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

            {/* MODAL CREATE / UPDATE */}
            {showModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingCategory ? "Cập nhật danh mục" : "Thêm danh mục"}
                                </h5>
                                <button className="btn-close" onClick={() => setShowModal(false)} />
                            </div>

                            <div className="modal-body">
                                <input
                                    className="form-control"
                                    placeholder="Tên danh mục"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Hủy
                                </button>
                                <button className="btn btn-success" onClick={handleSubmit}>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default CategoryManagement;
