// src/components/FeaturedProducts.js
import React, { useState, useEffect } from 'react';
import ProductCard from '../productCard/ProductCard';
import './FeaturedProducts.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    // const [activeTab, setActiveTab] = useState(0); // 0: Tất cả
    const navigate = useNavigate();

    // ✅ Gọi API lấy sản phẩm nổi bật
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:8080/api/products/getProductByTagOne',
                    {
                        params: {
                            tagId: 1,   // tag "Nổi bật"
                            page: 0,
                            size: 8    // số item cho slider
                        }
                    }
                );

                setProducts(res.data.content || []);
            } catch (err) {
                console.error('Lỗi khi gọi API sản phẩm nổi bật:', err);
            }
        };

        fetchProducts();
    }, []);


    // ✅ Gọi API lấy danh mục
    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         try {
    //             const res = await axios.get('http://localhost:8080/api/categories/getAll');
    //             setCategories(res.data || []);
    //         } catch (err) {
    //             console.error('Lỗi khi gọi API categories:', err);
    //         }
    //     };
    //     fetchCategories();
    // }, []);

    const goToProduct = () => navigate('/product');

    // ✅ Lọc sản phẩm theo danh mục
    // const getActiveProducts = () => {
    //     if (activeTab === 0) return products; // tất cả
    //     return products.filter(p => p.categoryId === activeTab);
    // };

    return (
        <section className="featured-products-section">
            <div className="container-product">
                <h2 className="section-title-product">Sản phẩm nổi bật</h2>

                {/* ✅ Tabs render động từ API */}
                {/*<div className="tabs-container">*/}
                {/*    /!* TẤT CẢ *!/*/}
                {/*    <button*/}
                {/*        className="featured-button"*/}
                {/*        onClick={() => navigate("/product")}*/}
                {/*    >*/}
                {/*        Tất cả*/}
                {/*    </button>*/}

                {/*    /!* CATEGORY *!/*/}
                {/*    {categories.map(cate => (*/}
                {/*        <button*/}
                {/*            key={cate.id}*/}
                {/*            className="featured-button"*/}
                {/*            onClick={() => navigate(`/product/category/${cate.id}`)}*/}
                {/*        >*/}
                {/*            {cate.name}*/}
                {/*        </button>*/}
                {/*    ))}*/}
                {/*</div>*/}

                <div className="products-grid">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard
                                key={product.productHashId}
                                product={{
                                    id: product.productHashId,
                                    name: product.productName,
                                    price: product.price.toLocaleString() + 'đ',
                                    image: `http://localhost:8080${product.image}`,
                                    tags: product.tags || [],
                                }}
                            />
                        ))
                    ) : (
                        <p>Không có sản phẩm.</p>
                    )}
                </div>


                <div className="view-all-button-container">
                    <button className="view-all-button" onClick={goToProduct}>
                        Xem tất cả sản phẩm
                    </button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProducts;
