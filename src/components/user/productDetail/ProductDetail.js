import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import './ProductDetail.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Rating from '@mui/material/Rating';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import axios from 'axios';

export default function ProductDetail() {
    const { hashId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/products/detail', {
                    params: { hashId },
                });
                setProduct(res.data);
            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [hashId]);

    if (loading) return <div>Đang tải...</div>;
    if (!product) return <div>Không tìm thấy sản phẩm</div>;

    const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
    const handleIncrease = () => setQuantity(prev => prev + 1);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 3000,
                    centerMode: false,
                    variableWidth: false,
                },
            },
        ],
    };

    return (
        <div className="product-detail-container">
            <Header />
            <hr width="100%" />

            <div className="product-detail-main">
                <div className="product-detail-content">
                    <div className="image-section">
                        <img
                            src={`http://localhost:8080${product.tastes[selectedImageIndex]?.image}`}
                            alt={`Ảnh ${product.tastes[selectedImageIndex]?.taste}`}
                            className="main-image"
                        />
                        <div className="thumbnail-container">
                            {product.tastes.map((t, index) => (
                                <img
                                    key={index}
                                    src={`http://localhost:8080${t.image}`}
                                    alt={`Ảnh ${index + 1}`}
                                    className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="info-section">
                        <h1 style={{ fontSize: '30px', fontFamily: 'bold' }}>
                            {product.name || 'Sản phẩm'}
                        </h1>
                        <p className="price">{product.tastes[selectedImageIndex]?.price?.toLocaleString()}đ</p>
                        <p className="description-1">{product.tastes[selectedImageIndex]?.secondDes}</p>

                        <div className="taste-selector">
                            <h4 className="taste-text">Hương vị:</h4>
                            {product.tastes.map((t, index) => (
                                <button
                                    key={index}
                                    className={`taste-button ${index === selectedImageIndex ? 'active' : ''}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    {t.taste}
                                </button>
                            ))}
                        </div>

                        <div className="quantity-section">
                            <h4>Số lượng:</h4>
                            <div className="quantity-control-product">
                                <button onClick={handleDecrease}>−</button>
                                <span>{quantity}</span>
                                <button onClick={handleIncrease}>+</button>
                            </div>
                        </div>

                        <div className="co-button">
                            <button className="atcart-button">Thêm vào giỏ hàng</button>
                            <button className="buy-button">Mua ngay</button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="description-2">{product.firstDes}</p>

            <div className="related-products">
                <h2>Bạn có thể thích?</h2>
                <Slider {...sliderSettings}>
                    {product.tastes.map((t, idx) => (
                        <div key={idx} className="product-detail-card">
                            <img src={`http://localhost:8080${t.image}`} alt={t.taste}/>
                            <h3>{t.taste}</h3>
                            <p className="price">{t.price.toLocaleString()}đ</p>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* phần review giữ nguyên layout */}
            <div className="review-section">
                <h2>Đánh giá sản phẩm</h2>
                <div className="review-summary">
                    <Rating
                        name="read-only"
                        value={5}
                        precision={0.5}
                        readOnly
                        icon={<FavoriteIcon fontSize="inherit" style={{ color: '#fe6a84' }} />}
                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" style={{ color: '#ccc' }} />}
                    />
                    <span className="review-score">5/5</span>
                    <span className="review-count">(10 đánh giá)</span>
                </div>

                <div className="review-form">
                    <h3>Viết đánh giá của bạn</h3>
                    <textarea placeholder="Cảm nhận của bạn về sản phẩm..." rows="4"></textarea>
                    <button>Gửi đánh giá</button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
