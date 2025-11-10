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


    // ------------------- Helpers -------------------
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
            ...p,
            name: p.productName || p.name,
            image: p.image,
            price: p.price,
            categoryId: p.categoryId ?? p.category?.id ?? p.category_id,
            tag: p.tag || p.tags || p.tagName
        }));

    // ------------------- React Query -------------------
    const {data: products = []} = useQuery({
        queryKey: ['products'],
        queryFn: () => fetch('http://localhost:8080/api/products').then(res => res.json()),
        staleTime: 1000 * 60, // 1 phút
        refetchInterval: 1000 * 60 * 5, // 5 phút
        refetchOnWindowFocus: true
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

    // ------------------- Effect price & base -------------------
    useEffect(() => {
        if (products.length) {
            const normalized = normalizeProducts(products);
            setCurrentResults(normalized);
            const maxFromApi = Math.max(...normalized.map(p => parsePrice(p.price)));
            setMaxPriceLimit(maxFromApi);
            setMaxPrice(maxFromApi);
            applyPriceFilter(normalized);
        }
    }, [products]);

    useEffect(() => {
        applyPriceFilter(currentResults);
    }, [maxPrice, currentResults]);

    // ------------------- Filter handlers -------------------
    const fetchFilteredProducts = async (categoryId, tagId) => {
        try {
            const query = new URLSearchParams();
            if (categoryId) query.append('categoryId', categoryId);
            if (tagId) query.append('tagId', tagId);

            const url = `http://localhost:8080/api/products/getProductByCategoryAndTag?${query.toString()}`;
            const res = await fetch(url);
            const data = await res.json();
            const normalized = normalizeProducts(data);

            setCurrentResults(normalized);
            applyPriceFilter(normalized);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCategoryClick = async (categoryId) => {
        setSelectedCate(categoryId);
        if (selectedTag.length > 0) {
            await fetchFilteredProducts(categoryId, selectedTag[0]);
            return;
        }

        const url = categoryId
            ? `http://localhost:8080/api/products/getProductByCategoryId?categoryId=${categoryId}`
            : `http://localhost:8080/api/products`;

        const res = await fetch(url);
        const data = await res.json();
        const normalized = normalizeProducts(data);

        setCurrentResults(normalized);
        applyPriceFilter(normalized);
    };

    const handleTagChange = async (tagId) => {
        const newSelectedTag = selectedTag.includes(tagId) ? [] : [tagId];
        setSelectedTag(newSelectedTag);

        if (selectedCate && newSelectedTag.length > 0) {
            await fetchFilteredProducts(selectedCate, tagId);
            return;
        }

        if (newSelectedTag.length > 0) {
            const res = await fetch(`http://localhost:8080/api/products/getProductByTag?tagId=${tagId}`);
            const data = await res.json();
            const normalized = normalizeProducts(data);

            setCurrentResults(normalized);
            applyPriceFilter(normalized);
            return;
        }

        if (selectedCate) {
            await handleCategoryClick(selectedCate);
        } else {
            const res = await fetch('http://localhost:8080/api/products');
            const data = await res.json();
            const normalized = normalizeProducts(data);
            setCurrentResults(normalized);
            applyPriceFilter(normalized);
        }
    };

    // ------------------- Render -------------------
    return (
        <div className="product-container">
            <Header/>
            <hr width="100%"/>
            <div className="product-page">
                <div className="filter-sidebar">
                    <h3 className="all-product"
                        tabindex="0"
                        style={{cursor: 'pointer'}}
                        onClick={async () => {
                            setSelectedCate('');
                            setSelectedTag([]);
                            const res = await fetch('http://localhost:8080/api/products');
                            const data = await res.json();
                            const normalized = normalizeProducts(data);
                            setCurrentResults(normalized);
                            applyPriceFilter(normalized);
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
                                    <button className="product-icon-button-heart">
                                        <Heart className="icon-svg-heart"/>
                                    </button>
                                </div>

                                {item.tag && (
                                    <div className="tag-container">
                                        <span className="tag">{item.tag}</span>
                                    </div>
                                )}
                                <h4 className="product-product-name">{item.productName || item.name}</h4>
                                <p className="product-product-price">{parsePrice(item.price).toLocaleString()}₫</p>
                                {/*<button className="product-icon-button" style={{}}>*/}
                                {/*    <Heart className="icon-svg"/>*/}
                                {/*</button>*/}
                                <button>Thêm vào giỏ hàng</button>
                            </div>
                        )) : (
                            <p className="notifi-no-product">Không có sản phẩm phù hợp.</p>
                        )}
                    </div>
                </div>
            </div>
            {/* Nút tròn mở bộ lọc (chỉ hiện mobile) */}
            <div tabindex="0"
                className="filter-fab"
                onClick={() => setShowFilterPopup(!showFilterPopup)}
            >
                <Cake className="product-cake" />
            </div>

            {/* Popup bộ lọc mobile */}
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
                            const res = await fetch('http://localhost:8080/api/products');
                            const data = await res.json();
                            const normalized = normalizeProducts(data);
                            setCurrentResults(normalized);
                            applyPriceFilter(normalized);
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
