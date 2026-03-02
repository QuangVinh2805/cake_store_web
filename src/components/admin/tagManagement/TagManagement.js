import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API = "http://localhost:8080/api/products";

const TagManagement = () => {
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [editingTag, setEditingTag] = useState(null);
    const [tagName, setTagName] = useState("");

    /* ================= LOAD ALL TAGS ================= */
    const fetchTags = async (pageNumber = 0) => {
        try {
            const res = await axios.get(`${API}/getAllTagsPaging`, {
                params: {
                    page: pageNumber,
                    size: 12
                }
            });

            setTags(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);

        } catch (e) {
            toast.error("Không tải được tag");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTags(0);
    }, []);


    /* ================= FILTER ================= */
    const filteredTags = tags.filter(t =>
        t.tagName?.toLowerCase().includes(search.toLowerCase())
    );

    /* ================= CREATE / UPDATE ================= */
    const handleSubmit = async () => {
        if (!tagName.trim()) {
            toast.error("Tên tag không được để trống");
            return;
        }

        try {
            if (editingTag) {
                // UPDATE
                const res = await axios.put(
                    `${API}/tag/update`,
                    { tagName },
                    { params: { id: editingTag.id } }
                );

                setTags(prev =>
                    prev.map(t => t.id === res.data.id ? res.data : t)
                );

                toast.success("Cập nhật tag thành công");
            } else {
                // CREATE
                const res = await axios.post(
                    `${API}/tag/create`,
                    { tagName }
                );

                setTags(prev => [...prev, res.data]);
                toast.success("Thêm tag thành công");
            }

            setShowModal(false);
            setTagName("");
            setEditingTag(null);

        } catch (err) {
            toast.error(err.response?.data?.message || "Thao tác thất bại");
        }
    };

    /* ================= CHANGE STATUS ================= */
    const handleChangeStatus = async (id) => {
        try {
            await axios.put(
                `${API}/changeStatusTag`,
                null,
                { params: { id } }
            );

            setTags(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, status: t.status === 1 ? 0 : 1 }
                        : t
                )
            );

            toast.success("Đổi trạng thái thành công");
        } catch {
            toast.error("Đổi trạng thái thất bại");
        }
    };

    /* ================= OPEN MODAL ================= */
    const openCreateModal = () => {
        setEditingTag(null);
        setTagName("");
        setShowModal(true);
    };

    const openEditModal = (tag) => {
        setEditingTag(tag);
        setTagName(tag.tagName);
        setShowModal(true);
    };

    return (
        <AdminLayout>
            <ToastContainer />

            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>
                    <i className="bi bi-bookmark-fill me-2"></i>
                    Tag Management
                </h2>

                <button className="btn btn-success" onClick={openCreateModal}>
                    <i className="bi bi-plus-circle me-1"></i>
                    Thêm tag
                </button>
            </div>

            {/* SEARCH */}
            <div className="mb-3">
                <div className="input-group">
                    <span className="input-group-text">
                        <i className="bi bi-search"></i>
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm theo tên tag..."
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
                                <th>Tên tag</th>
                                <th>Trạng thái</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredTags.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">
                                        Không tìm thấy tag
                                    </td>
                                </tr>
                            ) : (
                                filteredTags.map(t => (
                                    <tr key={t.id}>
                                        <td>{t.tagName}</td>

                                        <td className="text-center">
                                            {t.status === 1 ? (
                                                <span className="badge bg-success">Hoạt động</span>
                                            ) : (
                                                <span className="badge bg-secondary">Ẩn</span>
                                            )}
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-warning me-1"
                                                title="Cập nhật"
                                                onClick={() => openEditModal(t)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>

                                            <button
                                                className={`btn btn-sm ${t.status === 0 ? "btn-danger" : "btn-success"}`}
                                                title={t.status === 0 ? "Khóa" : "Mở"}
                                                onClick={() => handleChangeStatus(t.id)}
                                            >
                                                <i className={`bi ${t.status === 0 ? "bi-lock-fill" : "bi-unlock-fill"}`}></i>
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

            {/* MODAL */}
            {showModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {editingTag ? "Cập nhật tag" : "Thêm tag"}
                                </h5>
                                <button className="btn-close" onClick={() => setShowModal(false)} />
                            </div>

                            <div className="modal-body">
                                <input
                                    className="form-control"
                                    placeholder="Tên tag"
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)}
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

export default TagManagement;
