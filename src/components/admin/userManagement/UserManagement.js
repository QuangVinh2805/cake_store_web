import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import "./UserManagement.css";
import {toast, ToastContainer} from "react-toastify";


const UserManagement = () => {
    const [users, setUsers] = useState([]);

    const [page, setPage] = useState(0);
    const [size] = useState(12);
    const [totalPages, setTotalPages] = useState(0);


    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [mode, setMode] = useState("CREATE"); // CREATE | VIEW | UPDATE
    const [selectedUser, setSelectedUser] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [roleUser, setRoleUser] = useState(null);
    const [newRole, setNewRole] = useState("");

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        sex: "N",
        roleId: 2,
        birthday: ""
    });

    // useEffect(() => {
    //     setLoading(true);
    //
    //     axios.get("http://localhost:8080/api/users/getAll", {
    //         params: {
    //             page,
    //             size
    //         }
    //     })
    //         .then(res => {
    //             setUsers(res.data.content);
    //             setTotalPages(res.data.totalPages);
    //         })
    //         .catch(err => console.error(err))
    //         .finally(() => setLoading(false));
    //
    // }, [page, size]);


    const fetchUsers = async (pageNumber = 0) => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8080/api/users/getAll", {
                params: {
                    page: pageNumber,
                    size: 12
                }
            });

            setUsers(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };



    const getAvatar = (avatar) =>
        avatar ? `http://localhost:8080${avatar}` : "/avatar.jpg";

    // ================= FORM =================
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            phone: "",
            address: "",
            sex: "Nam",
            roleId: 2,
            birthday: ""
        });
        setAvatar(null);
        setSelectedUser(null);
    };

    // ================= GET USER BY HASH =================
    const fetchUserByHashId = async (hashId, modeType) => {
        try {
            const res = await axios.get(
                "http://localhost:8080/api/users/getInfoByHashId",
                { params: { hashId } }
            );

            const user = res.data;

            setSelectedUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                sex: user.sex,
                roleId: user.roleId,
                birthday: user.birthday?.substring(0, 10)
            });

            setMode(modeType);
            setShowModal(true);
        } catch {
            alert("Không lấy được thông tin user");
        }
    };

    const searchUsers = async (keyword, pageNumber = 0) => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8080/api/users/search", {
                params: {
                    keyword: keyword,
                    page: pageNumber,
                    size: 12
                }
            });

            setUsers(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
    };


    // ================= CREATE =================
    const handleCreateUser = async () => {
        try {
            const res = await axios.post(
                "http://localhost:8080/api/users/create",
                formData
            );

            setUsers(prev => [...prev, res.data]);
            toast.success("Tạo user thành công");
            setShowModal(false);
            resetForm();

        } catch (err) {
            const message =
                err.response?.data?.message || "Tạo user thất bại";

            toast.error(message); // 🔥 HIỂN THỊ MESSAGE BACKEND
        }
    };


    // ================= UPDATE =================
    const handleUpdateUser = async () => {
        try {
            const form = new FormData();
            form.append("hashId", selectedUser.hashId);
            form.append("data", JSON.stringify(formData));
            if (avatar) form.append("avatar", avatar);

            const res = await axios.put(
                "http://localhost:8080/api/users/updateByHashId",
                form,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setUsers(prev =>
                prev.map(u => u.hashId === selectedUser.hashId ? res.data : u)
            );

            toast.success("Cập nhật thành công");
            setShowModal(false);
            resetForm();

        } catch (err) {
            const message =
                err.response?.data?.message || "Cập nhật thất bại";

            toast.error(message);
        }
    };

    const handleChangeRole = async () => {
        if (!newRole) {
            toast.error("Vui lòng chọn role");
            return;
        }

        try {
            await axios.put(
                "http://localhost:8080/api/users/changeRole",
                { roleName: newRole },
                {
                    params: { hashId: roleUser.hashId }
                }
            );

            // update UI ngay
            setUsers(prev =>
                prev.map(u =>
                    u.hashId === roleUser.hashId
                        ? { ...u, role: newRole }
                        : u
                )
            );

            toast.success("Đổi role thành công");
            setShowRoleModal(false);
            setRoleUser(null);
            setNewRole("");

        } catch (err) {
            toast.error(err.response?.data?.message || "Đổi role thất bại");
        }
    };



    // ================= CHANGE STATUS =================
    const handleChangeStatus = async (hashId) => {
        try {
            await axios.put(
                "http://localhost:8080/api/users/changeStatus",
                null,
                { params: { hashId } }
            );

            setUsers(prev =>
                prev.map(u =>
                    u.hashId === hashId
                        ? { ...u, status: u.status === 1 ? 0 : 1 }
                        : u
                )
            );
            toast.success("Đổi trạng thái thành công");
        } catch {
            alert("Đổi trạng thái thất bại");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
    );

    useEffect(() => {
        const delayDebounce = setTimeout(() => {

            if (search.trim() === "") {
                fetchUsers(0);   // 🔁 quay về get all
            } else {
                searchUsers(search, 0); // 🔍 search
            }

        }, 500); // 0.5s debounce

        return () => clearTimeout(delayDebounce);
    }, [search]);


    const handlePageChange = (newPage) => {
        if (search.trim() === "") {
            fetchUsers(newPage);
        } else {
            searchUsers(search, newPage);
        }
    };


    return (
        <AdminLayout>
            <div className="d-flex justify-content-between mb-3">
                <h2>Quản lý người dùng</h2>
                <button
                    className="btn btn-success"
                    title="Thêm user"
                    onClick={() => {
                        resetForm();
                        setMode("CREATE");
                        setShowModal(true);
                    }}
                >
                    <i className="bi bi-person-plus-fill"></i>
                </button>
            </div>

            <input
                className="form-control mb-3"
                placeholder="Tìm kiếm..."
                value={search}
                onChange={handleSearchChange}
            />


            {loading ? "Loading..." : (
                <table className="table table-bordered">
                    <thead className="table-dark">
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>SĐT</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map(u => (
                        <tr key={u.hashId}>
                            <td>
                                <img src={getAvatar(u.avatar)} className="admin-avatar" />
                            </td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.phone}</td>
                            <td>{u.role}</td>
                            <td className="text-center">
                                {/* VIEW */}
                                <button
                                    className="btn btn-outline-info btn-sm me-1"
                                    title="Xem chi tiết"
                                    onClick={() => fetchUserByHashId(u.hashId, "VIEW")}
                                >
                                    <i className="bi bi-eye-fill"></i>
                                </button>

                                {/* UPDATE */}
                                <button
                                    className="btn btn-outline-warning btn-sm me-1"
                                    title="Chỉnh sửa"
                                    onClick={() => fetchUserByHashId(u.hashId, "UPDATE")}
                                >
                                    <i className="bi bi-pencil-square"></i>
                                </button>

                                {/* CHANGE STATUS */}
                                <button
                                    className={`btn btn-sm ${u.status === 0 ? "btn-outline-danger" : "btn-outline-success"}`}
                                    title={u.status === 0 ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                    onClick={() => handleChangeStatus(u.hashId)}
                                >
                                    <i className={`bi ${u.status === 1 ? "bi-unlock-fill" : "bi-lock-fill"}`}></i>
                                </button>

                                <button
                                    className="btn btn-outline-primary btn-sm me-1"
                                    title="Đổi role"
                                    onClick={() => {
                                        setRoleUser(u);
                                        setNewRole(u.role); // role hiện tại
                                        setShowRoleModal(true);
                                    }}
                                >
                                    <i className="bi bi-person-badge-fill"></i>
                                </button>


                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
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


            {/* ================= MODAL ================= */}
            {showModal && (
                <div className="modal d-block">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>{mode} USER</h5>
                                <button onClick={() => setShowModal(false)} className="btn-close" />
                            </div>
                            <div className="modal-body">

                                {/* ================= VIEW MODE ================= */}

                                {mode === "VIEW" && selectedUser && (
                                    <div className="row g-3">

                                        <div className="col-12 text-center">
                                            <img
                                                src={selectedUser.avatar
                                                    ? `http://localhost:8080${selectedUser.avatar}`
                                                    : "/avatar.jpg"}
                                                className="rounded-circle mb-3"
                                                width="120"
                                                alt="avatar"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Họ tên</label>
                                            <input className="form-control" value={selectedUser.name} disabled />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input className="form-control" value={selectedUser.email} disabled />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">SĐT</label>
                                            <input className="form-control" value={selectedUser.phone} disabled />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Giới tính</label>
                                            <input className="form-control" value={selectedUser.sex} disabled />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Ngày sinh</label>
                                            <input
                                                className="form-control"
                                                value={selectedUser.birthday?.substring(0, 10)}
                                                disabled
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Role</label>
                                            <input className="form-control" value={selectedUser.role} disabled />
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">Địa chỉ</label>
                                            <input className="form-control" value={selectedUser.address} disabled />
                                        </div>


                                        <div className="col-md-6">
                                            <label className="form-label">Trạng thái</label>
                                            <input
                                                className="form-control"
                                                value={selectedUser.status === 1 ? "Hoạt động" : "Bị khóa"}
                                                disabled
                                            />
                                        </div>


                                    </div>
                                )}

                                {/* ================= CREATE / UPDATE MODE ================= */}
                                {(mode === "CREATE" || mode === "UPDATE") && (
                                    <div className="row g-3">

                                        {/* Họ tên */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Họ tên <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                name="name"
                                                className="form-control"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Email <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                name="email"
                                                type="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        {/* Password chỉ CREATE */}
                                        {mode === "CREATE" && (
                                            <div className="col-md-6">
                                                <label className="form-label">
                                                    Mật khẩu <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    name="password"
                                                    type="password"
                                                    className="form-control"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Ít nhất 8 ký tự, chữ hoa, chữ thường, số"
                                                />
                                            </div>
                                        )}

                                        {/* SĐT */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                SĐT <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                name="phone"
                                                className="form-control"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                required
                                                placeholder="0xxxxxxxxx"
                                            />
                                        </div>

                                        {/* Giới tính */}
                                        <div className="col-md-6">
                                            <label className="form-label">Giới tính</label>
                                            <select
                                                name="sex"
                                                className="form-select"
                                                value={formData.sex}
                                                onChange={handleChange}
                                            >
                                                <option value="">-- Chọn --</option>
                                                <option value="Nam">Nam</option>
                                                <option value="Nữ">Nữ</option>
                                            </select>
                                        </div>

                                        {/* Ngày sinh */}
                                        <div className="col-md-6">
                                            <label className="form-label">
                                                Ngày sinh <span className="text-danger">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                name="birthday"
                                                className="form-control"
                                                value={formData.birthday}
                                                onChange={handleChange}
                                                required
                                            />
                                            <small className="text-muted">Phải từ 13 tuổi trở lên</small>
                                        </div>

                                        {/* Địa chỉ */}
                                        <div className="col-12">
                                            <label className="form-label">Địa chỉ</label>
                                            <input
                                                name="address"
                                                className="form-control"
                                                value={formData.address}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        {/* Role chỉ CREATE */}
                                        {mode === "CREATE" && (
                                            <div className="col-md-6">
                                                <label className="form-label">Role</label>
                                                <select
                                                    name="roleId"
                                                    className="form-select"
                                                    value={formData.roleId}
                                                    onChange={handleChange}
                                                >
                                                    <option value={1}>ADMIN</option>
                                                    <option value={2}>USER</option>
                                                </select>
                                            </div>
                                        )}

                                        {/* Avatar */}
                                        <div className="col-md-6">
                                            <label className="form-label">Avatar</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={e => setAvatar(e.target.files[0])}
                                            />
                                        </div>

                                    </div>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Đóng
                                </button>

                                {mode === "CREATE" && (
                                    <button className="btn btn-success" onClick={handleCreateUser}>
                                        Tạo user
                                    </button>
                                )}

                                {mode === "UPDATE" && (
                                    <button className="btn btn-warning" onClick={handleUpdateUser}>
                                        Cập nhật
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            )}
            {showRoleModal && roleUser && (
                <div className="modal d-block">
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5>Đổi role user</h5>
                                <button
                                    className="btn-close"
                                    onClick={() => setShowRoleModal(false)}
                                />
                            </div>

                            <div className="modal-body">
                                <p>
                                    User: <b>{roleUser.name}</b>
                                </p>

                                <label className="form-label">
                                    Role <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-select"
                                    value={newRole}
                                    onChange={e => setNewRole(e.target.value)}
                                >
                                    <option value="">-- Chọn role --</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="USER">USER</option>
                                </select>
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => setShowRoleModal(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={handleChangeRole}
                                >
                                    Lưu
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            <ToastContainer />
        </AdminLayout>
    );
};

export default UserManagement;
