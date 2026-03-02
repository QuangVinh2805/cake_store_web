import Header from '../header/Header';
import Footer from '../footer/Footer';
import './Product.css';
import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {Heart,Cake} from "lucide-react";

export default function Product() {
    const navigate = useNavigate();

    const [selectedCate, setSelectedCate] = useState('');
    const [selectedTag, setSelectedTag] = useState([]);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [maxPriceLimit, setMaxPriceLimit] = useState(100000);
    const [currentResults, setCurrentResults] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [showFilterPopup, setShowFilterPopup] = useState(false);
    const [page, setPage] = useState(0);
    const [size] = useState(12);
    const [totalPages, setTotalPages] = useState(0);



    const parsePrice = (price) => {
        if (price == null) return 0;
        if (typeof price === 'number') return price;
        const s = String(price).replace(/[₫,.]/g, '');
        const n = Number(s);
        return Number.isFinite(n) ? n : 0;
    };

    const applyPriceFilter = (baseArray) => {
        if (!Array.isArray(baseArray)) {
            setFilteredProducts([]);
            return;
        }
        const res = baseArray.filter(item => parsePrice(item.price) <= maxPrice);
        setFilteredProducts(res);
    };

    const getRangeStyle = () => {
        const percent = maxPriceLimit ? (maxPrice / maxPriceLimit) * 100 : 0;
        return {
            background: `linear-gradient(to right, #fe6a84 0%, #fe6a84 ${percent}%, #ddd ${percent}%, #ddd 100%)`
        };
    };

    const handleProductClick = (productHashId) => {
        navigate(`/product/${productHashId}`);
    };


    const normalizeProducts = (data) =>
        data.map(p => ({
            productHashId: p.productHashId,
            productName: p.productName,
            image: p.image,
            price: p.price,
            categoryId: p.categoryId,
            tags: p.tags || [],
            status: p.status
        }));


    const { data: productPage } = useQuery({
        queryKey: ['products', page, selectedCate, selectedTag[0] || ''],
        queryFn: () => {
            const params = new URLSearchParams({
                page,
                size
            });

            if (selectedCate) params.append('categoryId', selectedCate);
            if (selectedTag.length > 0) params.append('tagId', selectedTag[0]);

            let url = 'http://localhost:8080/api/products/getAllProductByStatus';

            if (selectedCate && selectedTag.length > 0) {
                url = 'http://localhost:8080/api/products/getProductByCategoryAndTag';
            } else if (selectedCate) {
                url = 'http://localhost:8080/api/products/getProductByCategoryId';
            } else if (selectedTag.length > 0) {
                url = 'http://localhost:8080/api/products/getProductByTag';
            }

            return fetch(`${url}?${params.toString()}`).then(res => res.json());
        },
        keepPreviousData: true
    });



    const {data: categories = []} = useQuery({
        queryKey: ['categories'],
        queryFn: () => fetch('http://localhost:8080/api/categories/getAll').then(res => res.json()),
        staleTime: 1000 * 60 * 60
    });

    const {data: allTags = []} = useQuery({
        queryKey: ['tags'],
        queryFn: () => fetch('http://localhost:8080/api/products/getAllTags').then(res => res.json()),
        staleTime: 1000 * 60 * 60
    });

    useEffect(() => {
        if (productPage?.content) {
            const normalized = normalizeProducts(productPage.content);
            setCurrentResults(normalized);
            setFilteredProducts(normalized);
            setTotalPages(productPage.totalPages || 1);

            const maxFromApi = Math.max(
                ...normalized.map(p => parsePrice(p.price)),
                0
            );
            setMaxPriceLimit(maxFromApi);
            setMaxPrice(maxFromApi);
        }
    }, [productPage]);


    useEffect(() => {
        applyPriceFilter(currentResults);
    }, [maxPrice, currentResults]);



    const handleCategoryClick = async (categoryId) => {
        setSelectedCate(categoryId);
        setPage(0);
    };

    const handleTagChange = async (tagId) => {
        const newTag = selectedTag.includes(tagId) ? [] : [tagId];
        setSelectedTag(newTag);
        setPage(0);
    };



    return (
        <div className="product-container">
            <Header/>
            <hr width="100%"/>
            <div className="product-page">
                <div className="filter-sidebar">
                    <h3 className="all-product"
                        tabindex="0"
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                            setSelectedCate('');
                            setSelectedTag([]);
                            setPage(0);
                        }}

                    >
                        Tất cả sản phẩm
                    </h3>

                    <ul>
                        {categories.map(cate => (
                            <li key={cate.id} onClick={() => handleCategoryClick(cate.id)} tabindex="0">
                                {cate.name || cate.categoryName}
                            </li>
                        ))}
                    </ul>

                    <h4>Lọc theo giá</h4>
                    <input
                        type="range"
                        min="0"
                        max={maxPriceLimit}
                        step="10000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        style={getRangeStyle()}
                    />
                    <p>Dưới {maxPrice.toLocaleString()}₫</p>

                    <h4>Lọc theo đặc điểm</h4>
                    {allTags.map(tag => (
                        <div key={tag.id}>
                            <input
                                type="checkbox"
                                id={`tag-${tag.id}`}
                                checked={selectedTag.includes(tag.id)}
                                onChange={() => handleTagChange(tag.id)}
                            />
                            <label htmlFor={`tag-${tag.id}`}>{tag.tagName}</label>
                        </div>
                    ))}
                </div>

                <div className="product-product-list">
                    <div className="products-product-grid">
                        {filteredProducts.length > 0 ? filteredProducts.map((item, index) => (
                            <div
                                className="product-product-card"
                                key={index}
                                onClick={() => handleProductClick(item.productHashId)}
                                style={{cursor: 'pointer'}}
                            >
                                <div className="product-image-wrapper">
                                    <img
                                        src={`${item.image ? `http://localhost:8080${item.image}` : ''}`}
                                        alt={item.productName || item.name}
                                    />
                                </div>

                                {item.tags.length > 0 && (
                                    <div className="tag-container">
                                        {item.tags.map((t, i) => (
                                            <span className="tag" key={i}>{t}</span>
                                        ))}
                                    </div>
                                )}
                                <h4 className="product-product-name">{item.productName || item.name}</h4>
                                <p className="product-product-price">{parsePrice(item.price).toLocaleString()}₫</p>
                                <button>Xem chi tiết</button>
                            </div>
                        )) : (
                            <p className="notifi-no-product">Không có sản phẩm phù hợp.</p>
                        )}
                    </div>
                    <div className="pagination">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            Trước
                        </button>

                        <span>Trang {page + 1} / {totalPages}</span>

                        <button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                        >
                            Sau
                        </button>
                    </div>
                </div>
            </div>
            <div tabindex="0"
                className="filter-fab"
                onClick={() => setShowFilterPopup(!showFilterPopup)}
            >
                <Cake className="product-cake" />
            </div>

            {showFilterPopup && (
                <div className="filter-popup">
    <span
        className="filter-popup-close"
        onClick={() => setShowFilterPopup(false)}
    >
      ✕
    </span>

                    <h3 className="all-product"
                        tabindex="0"
                        style={{ cursor: 'pointer' }}
                        onClick={async () => {
                            setSelectedCate('');
                            setSelectedTag([]);
                            setPage(0);
                        }}
                    >
                        Tất cả sản phẩm
                    </h3>

                    <ul>
                        {categories.map(cate => (
                            <li key={cate.id} onClick={() => handleCategoryClick(cate.id)} tabindex="0">
                                {cate.name || cate.categoryName}
                            </li>
                        ))}
                    </ul>

                    <h4>Lọc theo giá</h4>
                    <input
                        type="range"
                        min="0"
                        max={maxPriceLimit}
                        step="10000"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Number(e.target.value))}
                        style={getRangeStyle()}
                    />
                    <p>Dưới {maxPrice.toLocaleString()}₫</p>

                    <h4>Lọc theo đặc điểm</h4>
                    {allTags.map(tag => (
                        <div key={tag.id}>
                            <input
                                type="checkbox"
                                id={`tag-${tag.id}`}
                                checked={selectedTag.includes(tag.id)}
                                onChange={() => handleTagChange(tag.id)}
                            />
                            <label htmlFor={`tag-${tag.id}`}>{tag.tagName}</label>
                        </div>
                    ))}

                </div>
            )}
            <Footer/>
        </div>
    );
}
