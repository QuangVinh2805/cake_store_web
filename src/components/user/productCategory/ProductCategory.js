import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import ProductCard from "../productCard/ProductCard";
import axios from "axios";
import "./ProductCategory.css";

export default function ProductCategory() {
    const { id } = useParams();

    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    // 🔥 paging
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // 🔹 Lấy sản phẩm theo category (PAGING)
                const productRes = await axios.get(
                    "http://localhost:8080/api/products/getProductByCategoryId",
                    {
                        params: {
                            categoryId: id,
                            page: page,
                            size: 12
                        }
                    }
                );

                setProducts(productRes.data.content || []);
                setTotalPages(productRes.data.totalPages || 0);

                // 🔹 Lấy tên category
                const categoryRes = await axios.get(
                    "http://localhost:8080/api/categories/getById",
                    { params: { id } }
                );
                setCategoryName(categoryRes.data.name);

            } catch (e) {
                console.log("Load category product error", e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, page]);

    if (loading) return <div>Đang tải...</div>;

    return (
        <>
            <Header />

            <div className="product-category-page">
                <h2 className="category-title">
                    Danh mục: <span>{categoryName}</span>
                </h2>

                <div className="products-grid">
                    {products.length === 0 ? (
                        <p>Không có sản phẩm</p>
                    ) : (
                        products.map(product => (
                            <ProductCard
                                key={product.productHashId}
                                product={{
                                    id: product.productHashId,
                                    name: product.productName,
                                    price: product.price?.toLocaleString() + "đ",
                                    image: `http://localhost:8080${product.image}`,
                                    tags: product.tags || []
                                }}
                            />
                        ))
                    )}
                </div>

                {/* 🔥 PAGINATION */}
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
            </div>

            <Footer />
        </>
    );
}
