import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import ProductCard from "../productCard/ProductCard";
import "./ProductSearch.css";

export default function ProductSearch() {

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const size = 12;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);

                const res = await axios.get(
                    "http://localhost:8080/api/products/search",
                    {
                        params: {
                            keyword,
                            page,
                            size
                        }
                    }
                );

                setProducts(res.data.content || []);
                setTotalPages(res.data.totalPages || 0);

            } catch (error) {
                console.error("Search error", error);
            } finally {
                setLoading(false);
            }
        };

        if (keyword) fetchProducts();
    }, [keyword, page]);

    // reset page khi keyword thay đổi
    useEffect(() => {
        setPage(0);
    }, [keyword]);

    return (
        <>
            <Header />

            <div className="product-search-page">
                <h2 className="search-title">
                    Kết quả tìm kiếm cho: <span>{keyword}</span>
                </h2>

                {loading ? (
                    <p className="search-loading">Đang tải...</p>
                ) : products.length === 0 ? (
                    <p className="search-empty">Không tìm thấy sản phẩm phù hợp</p>
                ) : (
                    <>
                        <div className="products-grid">
                            {products.map(product => (
                                <ProductCard
                                    key={product.productHashId}
                                    product={{
                                        id: product.productHashId,
                                        name: product.productName,
                                        price: product.price.toLocaleString() + "đ",
                                        image: `http://localhost:8080${product.image}`,
                                        tags: product.tags
                                    }}
                                />
                            ))}
                        </div>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="pagination">
                                <button
                                    disabled={page === 0}
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    ‹
                                </button>

                                <span>
                                    Trang {page + 1} / {totalPages}
                                </span>

                                <button
                                    disabled={page === totalPages - 1}
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </>
    );
}
