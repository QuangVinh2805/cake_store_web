import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../AdminLayout";
import "./ProductManagement.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [size] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [productDetail, setProductDetail] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showAddTagModal, setShowAddTagModal] = useState(false);
    const [addTagData, setAddTagData] = useState({
        productHashId: "",
        tag: ""
    });

// ===== ADD TASTE =====
    const [showAddTasteModal, setShowAddTasteModal] = useState(false);
    const [addTasteData, setAddTasteData] = useState({
        productHashId: "",
        taste: "",
        price: "",
        quantity: "",
        secondDes: ""
    });
    const [addTasteImage, setAddTasteImage] = useState(null);
    const [productForm, setProductForm] = useState({
        name: "",
        price: "",
        firstDes: "",
        categoryId: ""
    });
    const [productImage, setProductImage] = useState(null);

    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updatingProduct, setUpdatingProduct] = useState(null);

    const [updateProductForm, setUpdateProductForm] = useState({
        name: "",
        price: "",
        firstDes: "",
        categoryId: ""
    });

    useEffect(() => {
            fetch("http://localhost:8080/api/categories/getAll")
                .then(res => res.json())
                .then(data => setCategories(data))
                .catch(err => console.error(err));
    }, []);


    const [updateImage, setUpdateImage] = useState(null);

    const [updateTags, setUpdateTags] = useState({
        oldTags: [],
        newTags: []
    });

    const [selectedUpdateTags, setSelectedUpdateTags] = useState([]);



    const [updateTastes, setUpdateTastes] = useState([]);

    const [tags, setTags] = useState("");
    const [allTags, setAllTags] = useState([]);
    const [selectedUpdateTag, setSelectedUpdateTag] = useState("");
    const [selectedTags, setSelectedTags] = useState("");

    useEffect(() => {
        fetch("http://localhost:8080/api/products/getAllTags")
            .then(res => res.json())
            .then(data => setAllTags(data))
            .catch(err => console.error(err));
    }, []);

    const [tastes, setTastes] = useState([]);
    const addTaste = () => {
        setTastes([
            ...tastes,
            { taste: "", price: "", quantity: "", secondDes: "", image: null }
        ]);
    };

    const updateTaste = (index, field, value) => {
        const newTastes = [...tastes];
        newTastes[index][field] = value;
        setTastes(newTastes);
    };

    const openUpdateModal = async (product) => {
        console.log("product từ bảng:", product);

        try {
            const res = await axios.get(
                "http://localhost:8080/api/products/detail",
                {
                    params: { hashId: product.productHashId }
                }
            );

            const detail = res.data;

            setUpdatingProduct({
                ...detail,
                productHashId: detail.hashId
            });

            setUpdateProductForm({
                name: detail.name,
                price: detail.price,
                firstDes: detail.firstDes,
                categoryId: detail.categoryId
            });

            // ✅ TAG CŨ = toàn bộ tag hiện tại của product
            setUpdateTags({
                oldTags: product.tags || [],   // 👈 LIST STRING
                newTags: []
            });

            setSelectedUpdateTags([]); // reset checkbox

            setUpdateTastes(detail.tastes || []);
            setShowUpdateModal(true);

        } catch (err) {
            toast.error("Không lấy được chi tiết sản phẩm");
        }
    };




    const handleViewDetail = async (hashId) => {
        try {
            setDetailLoading(true);
            setShowDetailModal(true);

            const token = localStorage.getItem("token"); // nếu có login

            const res = await axios.get(
                "http://localhost:8080/api/products/detail",
                {
                    params: {
                        hashId,
                        token
                    }
                }
            );

            setProductDetail(res.data);
        } catch (err) {
            toast.error(err.response?.data?.message || "Không lấy được chi tiết sản phẩm");
            setShowDetailModal(false);
        } finally {
            setDetailLoading(false);
        }
    };




    const fetchProducts = async (pageNumber = 0) => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:8080/api/products", {
                params: {
                    page: pageNumber,
                    size: size
                }
            });

            setProducts(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const searchProducts = async (keyword, pageNumber = 0) => {
        try {
            setLoading(true);
            const res = await axios.get(
                "http://localhost:8080/api/products/searchAllProduct",
                {
                    params: {
                        keyword: keyword,
                        page: pageNumber,
                        size: size
                    }
                }
            );

            setProducts(res.data.content);
            setTotalPages(res.data.totalPages);
            setPage(res.data.number);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(0);
    }, []);





    const filteredProducts = products.filter(p =>
        p.productName?.toLowerCase().includes(search.toLowerCase()) ||
        p.categoryName?.toLowerCase().includes(search.toLowerCase())
    );

    const getImage = (img) => {
        return img ? `http://localhost:8080${img}` : "/product-default.jpg";
    };

    const handleCreateProduct = async () => {

        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            toast.info("Đang tạo sản phẩm...");

            /* ================== 1. CREATE PRODUCT ================== */
            const productData = new FormData();
            productData.append(
                "data",
                JSON.stringify({
                    name: productForm.name,
                    price: Number(productForm.price),
                    firstDes: productForm.firstDes,
                    categoryId: Number(productForm.categoryId)
                })
            );

            if (productImage) {
                productData.append("image", productImage);
            }

            const productRes = await axios.post(
                "http://localhost:8080/api/products/create",
                productData
            );

            const productHashId = productRes.data.hashId;

            /* ================== 2. CREATE TAG ================== */
            const tagList = tags.split(",").map(t => t.trim()).filter(Boolean);

            for (const tag of tagList) {
                await axios.post("http://localhost:8080/api/products/createTag", null, {
                    params: {
                        productHashId,
                        tag
                    }
                });
            }

            /* ================== 3. CREATE TASTE ================== */
            for (const t of tastes) {
                const tasteForm = new FormData();
                tasteForm.append(
                    "data",
                    JSON.stringify({
                        productHashId,
                        taste: t.taste,
                        price: Number(t.price),
                        quantity: Number(t.quantity),
                        secondDes: t.secondDes
                    })
                );

                if (t.image) {
                    tasteForm.append("image", t.image);
                }

                await axios.post(
                    "http://localhost:8080/api/products/taste/create",
                    tasteForm
                );
            }

            toast.success("Tạo sản phẩm thành công!",{autoClose: 4000});
            setShowModal(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || " Tạo sản phẩm thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };


    const handleUpdateProduct = async () => {

        try {
            toast.info("Đang cập nhật...");

            /* ===== 1. UPDATE PRODUCT ===== */
            const formData = new FormData();
            formData.append("data", JSON.stringify(updateProductForm));

            if (updateImage) {
                formData.append("image", updateImage);
            }

            await axios.put(
                "http://localhost:8080/api/products/update",
                formData,
                {
                    params: { hashId: updatingProduct.productHashId }
                }
            );

            console.log("updateTags:", updateTags);

            if (
                updateTags.oldTags?.length > 0 &&
                updateTags.newTags?.length > 0
            ) {
                await axios.put(
                    "http://localhost:8080/api/products/updateTag",
                    {
                        productHashId: updatingProduct.productHashId,
                        oldTags: updateTags.oldTags,
                        newTags: updateTags.newTags
                    }
                );
            }


            /* ===== 3. UPDATE TASTE ===== */
            for (const t of updateTastes) {
                const tasteForm = new FormData();
                tasteForm.append(
                    "data",
                    JSON.stringify({
                        productHashId: updatingProduct.productHashId,
                        taste: t.taste,
                        price: t.price,
                        quantity: t.quantity,
                        secondDes: t.secondDes
                    })
                );

                if (t.newImage) {
                    tasteForm.append("image", t.newImage);
                }

                await axios.put(
                    "http://localhost:8080/api/products/taste/update",
                    tasteForm
                );
            }

            toast.success("Cập nhật thành công");
            setShowUpdateModal(false);
            setTimeout(() => {
                window.location.reload();
            }, 2000);

        } catch (err) {
            console.error(err);
            toast.error("Cập nhật thất bại");
        }
    };

    const handleChangeStatus = async (hashId) => {
        try {
            await axios.put(
                "http://localhost:8080/api/products/changeStatus",
                null,
                {
                    params: { hashId }
                }
            );

            setProducts(prev =>
                prev.map(p =>
                    p.productHashId === hashId
                        ? { ...p, status: p.status === 1 ? 0 : 1 }
                        : p
                )
            );
            toast.success("Đổi trạng thái thành công");
        } catch (err) {
            toast.error("Đổi trạng thái thất bại");
        }
    };

    useEffect(() => {
        const delay = setTimeout(() => {
            if (search.trim() === "") {
                fetchProducts(0);      // quay về getAll
            } else {
                searchProducts(search, 0); // search
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [search]);


    const handlePageChange = (newPage) => {
        if (search.trim() === "") {
            fetchProducts(newPage);
        } else {
            searchProducts(search, newPage);
        }
    };

    const removeTaste = (index) => {
        if (tastes.length === 1) return; // luôn giữ ít nhất 1 taste

        setTastes(prev => prev.filter((_, i) => i !== index));
    };





    return (
        <AdminLayout>
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>
                    <i className="bi bi-box-seam me-2"></i>
                    Product Management
                </h2>

                <button
                    className="btn btn-success"
                    onClick={() => setShowModal(true)}
                >
                    <i className="bi bi-plus-circle me-1"></i>
                    Thêm sản phẩm
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
                        placeholder="Tìm theo tên sản phẩm hoặc danh mục..."
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
                                <th>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Danh mục</th>
                                <th>Tag</th>
                                <th>Giá</th>
                                <th>Action</th>
                            </tr>
                            </thead>

                            <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center text-muted">
                                        Không tìm thấy sản phẩm
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(p => (
                                    <tr key={p.productHashId}>
                                        <td className="text-center">
                                            <img
                                                src={getImage(p.image)}
                                                alt={p.productName}
                                                className="admin-product-image"
                                            />
                                        </td>

                                        <td>{p.productName}</td>

                                        <td className="text-center">
                                            <span className="badge bg-info">
                                                {p.categoryName}
                                            </span>
                                        </td>

                                        <td className="text-center">
                                            {p.tags.map((tag, i) => (
                                                <span key={i} className="badge bg-warning text-dark me-1">
            {tag}
        </span>
                                            ))}
                                        </td>


                                        <td className="text-end">
                                            {p.price.toLocaleString()}đ
                                        </td>

                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-info me-1"
                                                title="Xem chi tiết"
                                                onClick={() => handleViewDetail(p.productHashId)}
                                            >
                                                <i className="bi bi-eye"></i>
                                            </button>


                                            <button
                                                className="btn btn-sm btn-warning me-1"
                                                onClick={() => openUpdateModal(p)}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>

                                            {/* ➕ ADD TAG */}
                                            <button
                                                className="btn btn-sm btn-primary me-1"
                                                title="Thêm Tag"
                                                onClick={() => {
                                                    setAddTagData({ productHashId: p.productHashId, tag: "" });
                                                    setShowAddTagModal(true);
                                                }}
                                            >
                                                <i className="bi bi-tags"></i>
                                            </button>

                                            {/* ➕ ADD TASTE */}
                                            <button
                                                className="btn btn-sm btn-success me-1"
                                                title="Thêm Taste"
                                                onClick={() => {
                                                    setAddTasteData({
                                                        productHashId: p.productHashId,
                                                        taste: "",
                                                        price: "",
                                                        quantity: "",
                                                        secondDes: ""
                                                    });
                                                    setAddTasteImage(null);
                                                    setShowAddTasteModal(true);
                                                }}
                                            >
                                                <i className="bi bi-plus-circle"></i>
                                            </button>


                                            <button
                                                className={`btn btn-sm ${p.status === 0 ? "btn-danger" : "btn-success"}`}
                                                title={p.status === 0 ? "Khóa sản phẩm" : "Mở sản phẩm"}
                                                onClick={() => handleChangeStatus(p.productHashId)}
                                            >
                                                <i className={`bi ${p.status === 0 ? "bi-lock-fill" : "bi-unlock-fill"}`}></i>
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



            {showModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm sản phẩm</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)} />
                            </div>

                            <div className="modal-body">
                                <input className="form-control mb-2"
                                       placeholder="Tên sản phẩm"
                                       onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                                />

                                <input className="form-control mb-2"
                                       placeholder="Giá"
                                       type="number"
                                       onChange={e => setProductForm({ ...productForm, price: e.target.value })}
                                />

                                <textarea className="form-control mb-2"
                                          placeholder="Mô tả"
                                          onChange={e => setProductForm({ ...productForm, firstDes: e.target.value })}
                                />

                                <select
                                    className="form-control mb-2"
                                    value={productForm.categoryId || ""}
                                    onChange={e =>
                                        setProductForm({
                                            ...productForm,
                                            categoryId: e.target.value
                                        })
                                    }
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>

                                <input type="file" className="form-control mb-3"
                                       onChange={e => setProductImage(e.target.files[0])}
                                />

                                <div className="mb-3">
                                    <label className="form-label">Chọn tag</label>

                                    {allTags.map(tag => (
                                        <div key={tag.id} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={tag.tagName}
                                                checked={selectedTags.includes(tag.tagName)}
                                                onChange={e => {
                                                    const value = e.target.value;

                                                    setSelectedTags(prev => {
                                                        const newTags = prev.includes(value)
                                                            ? prev.filter(t => t !== value)
                                                            : [...prev, value];

                                                        // backend nhận chuỗi
                                                        setTags(newTags.join(","));
                                                        return newTags;
                                                    });
                                                }}
                                            />
                                            <label className="form-check-label">
                                                {tag.tagName}
                                            </label>
                                        </div>
                                    ))}
                                </div>



                                <hr />
                                <h6>Vị bánh</h6>

                                {tastes.map((t, i) => (
                                    <div key={i} className="border p-2 mb-2 rounded position-relative">

                                        {/* ❌ nút xoá */}
                                        {tastes.length > 1 && (
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute"
                                                style={{ top: 8, right: 8 }}
                                                onClick={() => removeTaste(i)}
                                            >
                                                ✕
                                            </button>
                                        )}

                                        <input
                                            className="form-control mb-1"
                                            placeholder="Tên vị"
                                            onChange={e => updateTaste(i, "taste", e.target.value)}
                                        />

                                        <input
                                            className="form-control mb-1"
                                            placeholder="Giá"
                                            type="number"
                                            onChange={e => updateTaste(i, "price", e.target.value)}
                                        />

                                        <input
                                            className="form-control mb-1"
                                            placeholder="Số lượng"
                                            type="number"
                                            onChange={e => updateTaste(i, "quantity", e.target.value)}
                                        />

                                        <textarea
                                            className="form-control mb-1"
                                            placeholder="Mô tả vị"
                                            onChange={e => updateTaste(i, "secondDes", e.target.value)}
                                        />

                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={e => updateTaste(i, "image", e.target.files[0])}
                                        />
                                    </div>
                                ))}

                                <button className="btn btn-outline-primary" onClick={addTaste}>
                                    + Thêm vị
                                </button>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    disabled={isSubmitting}
                                    onClick={handleCreateProduct}
                                >
                                    {isSubmitting ? "Đang lưu..." : "Lưu"}
                                </button>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showDetailModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog modal-xl modal-dialog-scrollable">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Chi tiết sản phẩm
                                </h5>
                                <button className="btn-close" onClick={() => setShowDetailModal(false)} />
                            </div>

                            <div className="modal-body">
                                {detailLoading ? (
                                    <div className="text-center">Đang tải...</div>
                                ) : productDetail && (
                                    <>
                                        {/* TÊN + FAV */}
                                        <h4 className="mb-2">
                                            {productDetail.name}
                                            {productDetail.statusFavourite === 1 && (
                                                <i className="bi bi-heart-fill text-danger ms-2"></i>
                                            )}
                                        </h4>
                                        <h4>
                                            Thể loại : {productDetail.categoryName}
                                        </h4>
                                        {/* MÔ TẢ */}
                                        <p className="text-muted">
                                            {productDetail.firstDes}
                                        </p>

                                        <hr />

                                        {/* TASTES */}
                                        <h5 className="mb-3">Các vị bánh</h5>

                                        <div className="row">
                                            {productDetail.tastes.map((t) => (
                                                <div key={t.productTasteId} className="col-md-6 mb-3">
                                                    <div className="card h-100 shadow-sm">
                                                        <div className="row g-0">
                                                            <div className="col-md-4">
                                                                <img
                                                                    src={`http://localhost:8080${t.image}`}
                                                                    className="img-fluid rounded-start"
                                                                    alt={t.taste}
                                                                />
                                                            </div>

                                                            <div className="col-md-8">
                                                                <div className="card-body">
                                                                    <h6 className="card-title">{t.taste}</h6>

                                                                    <p className="card-text small">
                                                                        {t.secondDes}
                                                                    </p>

                                                                    <div className="d-flex justify-content-between">
                                                            <span className="fw-bold text-danger">
                                                                {t.price.toLocaleString()}đ
                                                            </span>
                                                                        <span className="badge bg-secondary">
                                                                SL: {t.quantity}
                                                            </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                                    Đóng
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            {showUpdateModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog modal-lg modal-dialog-scrollable">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5>Cập nhật sản phẩm</h5>
                                <button className="btn-close" onClick={() => setShowUpdateModal(false)} />
                            </div>

                            <div className="modal-body">

                                <input
                                    className="form-control mb-2"
                                    value={updateProductForm.name}
                                    onChange={e =>
                                        setUpdateProductForm({ ...updateProductForm, name: e.target.value })
                                    }
                                    placeholder="Tên sản phẩm"
                                />

                                <input
                                    className="form-control mb-2"
                                    type="number"
                                    value={updateProductForm.price ?? ""}
                                    onChange={e =>
                                        setUpdateProductForm({ ...updateProductForm, price: e.target.value })
                                    }
                                    placeholder="Giá"
                                />

                                <select
                                    className="form-control mb-2"
                                    value={updateProductForm.categoryId ?? ""}
                                    onChange={e =>
                                        setUpdateProductForm({
                                            ...updateProductForm,
                                            categoryId: e.target.value
                                        })
                                    }
                                >
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>


                                <textarea
                                    className="form-control mb-2"
                                    value={updateProductForm.firstDes}
                                    onChange={e =>
                                        setUpdateProductForm({ ...updateProductForm, firstDes: e.target.value })
                                    }
                                    placeholder="Mô tả"
                                />

                                <input
                                    type="file"
                                    className="form-control mb-3"
                                    onChange={e => setUpdateImage(e.target.files[0])}
                                />

                                <hr />
                                <h6>Update Tag</h6>

                                <div className="border rounded p-2 mb-3" style={{ maxHeight: 200, overflowY: "auto" }}>
                                    {allTags.map(tag => {
                                        const checked = selectedUpdateTags.includes(tag.tagName);

                                        return (
                                            <div key={tag.id} className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`tag-${tag.id}`}
                                                    checked={checked}
                                                    onChange={e => {
                                                        let newSelected;

                                                        if (e.target.checked) {
                                                            newSelected = [...selectedUpdateTags, tag.tagName];
                                                        } else {
                                                            newSelected = selectedUpdateTags.filter(
                                                                t => t !== tag.tagName
                                                            );
                                                        }

                                                        setSelectedUpdateTags(newSelected);
                                                        setUpdateTags(prev => ({
                                                            ...prev,
                                                            newTags: newSelected   // 👈 LIST STRING
                                                        }));
                                                    }}
                                                />

                                                <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                                                    {tag.tagName}
                                                </label>
                                            </div>
                                        );
                                    })}
                                </div>

                                <small className="text-muted">
                                    Tick chọn các tag mới để thay thế toàn bộ tag cũ
                                </small>




                                <hr />
                                <h6>Update Taste</h6>

                                {updateTastes.map((t, i) => (
                                    <div key={i} className="border rounded p-2 mb-2">

                                        <strong>{t.taste}</strong>

                                        <input
                                            className="form-control mb-1"
                                            type="number"
                                            value={t.price}
                                            onChange={e => {
                                                const list = [...updateTastes];
                                                list[i].price = e.target.value;
                                                setUpdateTastes(list);
                                            }}
                                            placeholder="Giá"
                                        />

                                        <input
                                            className="form-control mb-1"
                                            type="number"
                                            value={t.quantity}
                                            onChange={e => {
                                                const list = [...updateTastes];
                                                list[i].quantity = e.target.value;
                                                setUpdateTastes(list);
                                            }}
                                            placeholder="Số lượng"
                                        />

                                        <textarea
                                            className="form-control mb-1"
                                            value={t.secondDes}
                                            onChange={e => {
                                                const list = [...updateTastes];
                                                list[i].secondDes = e.target.value;
                                                setUpdateTastes(list);
                                            }}
                                            placeholder="Mô tả vị"
                                        />

                                        <input
                                            type="file"
                                            className="form-control"
                                            onChange={e => {
                                                const list = [...updateTastes];
                                                list[i].newImage = e.target.files[0];
                                                setUpdateTastes(list);
                                            }}
                                        />
                                    </div>
                                ))}

                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowUpdateModal(false)}>
                                    Hủy
                                </button>
                                <button className="btn btn-warning" onClick={handleUpdateProduct}>
                                    Lưu thay đổi
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {showAddTagModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5>Thêm Tag</h5>
                                <button className="btn-close" onClick={() => setShowAddTagModal(false)} />
                            </div>

                            <div className="modal-body">
                                <input
                                    className="form-control"
                                    placeholder="Nhập tag mới"
                                    value={addTagData.tag}
                                    onChange={e =>
                                        setAddTagData({ ...addTagData, tag: e.target.value })
                                    }
                                />
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddTagModal(false)}>
                                    Hủy
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={async () => {
                                        try {
                                            await axios.post(
                                                "http://localhost:8080/api/products/createTag",
                                                null,
                                                {
                                                    params: {
                                                        productHashId: addTagData.productHashId,
                                                        tag: addTagData.tag
                                                    }
                                                }
                                            );
                                            toast.success("✅ Thêm tag thành công");
                                            setShowAddTagModal(false);
                                            window.location.reload();
                                        } catch {
                                            toast.error("❌ Thêm tag thất bại");
                                        }
                                    }}
                                >
                                    Lưu
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            {showAddTasteModal && (
                <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.5)" }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">

                            <div className="modal-header">
                                <h5>Thêm Taste</h5>
                                <button className="btn-close" onClick={() => setShowAddTasteModal(false)} />
                            </div>

                            <div className="modal-body">

                                <input
                                    className="form-control mb-2"
                                    placeholder="Tên vị"
                                    onChange={e => setAddTasteData({ ...addTasteData, taste: e.target.value })}
                                />

                                <input
                                    className="form-control mb-2"
                                    type="number"
                                    placeholder="Giá"
                                    onChange={e => setAddTasteData({ ...addTasteData, price: e.target.value })}
                                />

                                <input
                                    className="form-control mb-2"
                                    type="number"
                                    placeholder="Số lượng"
                                    onChange={e => setAddTasteData({ ...addTasteData, quantity: e.target.value })}
                                />

                                <textarea
                                    className="form-control mb-2"
                                    placeholder="Mô tả vị"
                                    onChange={e => setAddTasteData({ ...addTasteData, secondDes: e.target.value })}
                                />

                                <input
                                    type="file"
                                    className="form-control"
                                    onChange={e => setAddTasteImage(e.target.files[0])}
                                />

                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowAddTasteModal(false)}>
                                    Hủy
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={async () => {
                                        try {
                                            const form = new FormData();
                                            form.append(
                                                "data",
                                                JSON.stringify({
                                                    ...addTasteData,
                                                    price: Number(addTasteData.price),
                                                    quantity: Number(addTasteData.quantity)
                                                })
                                            );
                                            if (addTasteImage) {
                                                form.append("image", addTasteImage);
                                            }

                                            await axios.post(
                                                "http://localhost:8080/api/products/taste/create",
                                                form
                                            );

                                            toast.success("✅ Thêm taste thành công");
                                            setShowAddTasteModal(false);
                                            window.location.reload();
                                        } catch {
                                            toast.error("❌ Thêm taste thất bại");
                                        }
                                    }}
                                >
                                    Lưu
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

            <ToastContainer/>
        </AdminLayout>
    );
};

export default ProductManagement;
