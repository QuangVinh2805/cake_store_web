import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export default function ProductDetail() {
    const navigate = useNavigate();

    const { hashId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [avgRate, setAvgRate] = useState(0);
    const [isFavourite, setIsFavourite] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);


    const [reviewForm, setReviewForm] = useState({
        productTasteId: "",
        comment: "",
        rate: 5
    });

    const [reviewImage, setReviewImage] = useState(null);


    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = localStorage.getItem("token"); // Lấy token
                const res = await axios.get('http://localhost:8080/api/products/detail', {
                    params: {
                        hashId,
                        token: token // Gửi token lên để check favourite status
                    },
                });

                setProduct(res.data);
                // Cập nhật trạng thái trái tim từ API trả về
                setIsFavourite(res.data.statusFavourite === 1);

            } catch (error) {
                console.error('Lỗi khi gọi API:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [hashId]);


    useEffect(() => {
        if (!product?.hashId) return;

        axios
            .get(`http://localhost:8080/api/recommend/${product.hashId}`)
            .then(res => {
                setRelatedProducts(res.data);
            })
            .catch(err => {
                console.error("Recommend error", err);
            });
    }, [product?.hashId]);



    const handleToggleFavourite = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            toast.warning("Bạn cần đăng nhập để yêu thích sản phẩm");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8080/api/products/favourite", {
                token: token,
                hashId: hashId
            });
            // Cập nhật state ngay lập tức để icon đổi màu
            setIsFavourite(res.data.status === 1);
            if (res.data.status === 1) toast.success("Đã thêm vào yêu thích");
            else toast.success("Đã bỏ yêu thích");
        } catch (err) {
            toast.error("Thao tác thất bại");
        }
    };

    const fetchReviews = async () => {
        try {
            const [reviewRes, avgRes] = await Promise.all([
                axios.get("http://localhost:8080/api/reviews/product", {
                    params: { hashId }
                }),
                axios.get("http://localhost:8080/api/reviews/product/avg", {
                    params: { hashId }
                })
            ]);

            setReviews(reviewRes.data);
            setAvgRate(avgRes.data || 0);
        } catch (err) {
            console.log("Load review error");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [hashId]);


    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewForm(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmitReview = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.warning("Bạn cần đăng nhập để đánh giá");
            return;
        }

        if (!reviewForm.productTasteId) {
            toast.warning("Vui lòng chọn hương vị");
            return;
        }

        const formData = new FormData();
        formData.append("token", token);
        formData.append("productTasteId", reviewForm.productTasteId);
        formData.append("comment", reviewForm.comment);
        formData.append("rate", parseInt(reviewForm.rate)); // ⭐ QUAN TRỌNG

        if (reviewImage) {
            formData.append("image", reviewImage);
        }

        try {
            await axios.post(
                "http://localhost:8080/api/reviews/create",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            toast.success("Đánh giá thành công");

            await fetchReviews();


            // reset form
            setReviewForm({
                productTasteId: "",
                comment: "",
                rate: 5
            });
            setReviewImage(null);

        } catch (err) {
            if (err.response) {
                const data = err.response.data;

                if (typeof data === "string") {
                    toast.error(data);
                } else if (data.message) {
                    toast.error(data.message);
                } else {
                    toast.error("Đánh giá thất bại");
                }
            } else {
                toast.error("Không thể kết nối tới server");
            }
        }
    };





    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.warning("Bạn cần đăng nhập để thêm vào giỏ hàng");
                return;
            }

            const selectedTaste = product.tastes[selectedImageIndex];

            if (!selectedTaste?.productTasteId) {
                toast.error("Không xác định được hương vị sản phẩm");
                return;
            }

            const payload = {
                token: token,
                productTasteId: selectedTaste.productTasteId,
                quantity: quantity,
                unitPrice: selectedTaste.price
            };

            await axios.post(
                "http://localhost:8080/api/cart/add",
                payload
            );

            toast.success("Đã thêm vào giỏ hàng");

        } catch (err) {
            if (err.response) {
                const data = err.response.data;

                if (typeof data === "string") {
                    toast.error(data);
                } else if (data.message) {
                    toast.error(data.message);
                } else {
                    toast.error("Thêm vào giỏ hàng thất bại");
                }
            } else {
                toast.error("Không thể kết nối tới server");
            }
        }

    };

    const handleProductClick = (hashId) => {
        navigate(`/product/${hashId}`);
    };




    if (loading) return <div>Đang tải...</div>;
    if (!product) return <div>Không tìm thấy sản phẩm</div>;

    const handleDecrease = () => setQuantity(prev => Math.max(1, prev - 1));
    const handleIncrease = () => setQuantity(prev => prev + 1);

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
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
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h1 style={{ fontSize: '30px', fontWeight: 'bold', margin: 0 }}>
                                {product.name}
                            </h1>
                            <div onClick={handleToggleFavourite} style={{ cursor: 'pointer', marginLeft: '20px' }}>
                                {isFavourite ? (
                                    <FavoriteIcon style={{ color: '#fe6a84', fontSize: '32px' }} />
                                ) : (
                                    <FavoriteBorderIcon style={{ color: '#ccc', fontSize: '32px' }} />
                                )}
                            </div>
                        </div>
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

                        <div className="quantityy-selector">
                            <h4 className="quantityy-text">
                                Số lượng còn lại : {product.tastes[selectedImageIndex]?.quantity ?? 0}
                            </h4>
                        </div>


                        <div className="quantity-section">
                            <h4>Số lượng muốn mua :</h4>
                            <div className="quantity-control-product">
                                <button onClick={handleDecrease}>−</button>
                                <span>{quantity}</span>
                                <button onClick={handleIncrease}>+</button>
                            </div>
                        </div>

                        <div className="co-button">
                            <button className="atcart-button" onClick={handleAddToCart}>
                                Thêm vào giỏ hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <p className="description-2">{product.firstDes}</p>

            <div className="related-products">
                <h2>Bạn có thể thích?</h2>

                <Slider {...sliderSettings}>
                    {relatedProducts.map((item, idx) => (
                        <div key={idx} className="product-detail-card"
                             onClick={() => handleProductClick(item.hashId)}
                        >
                            <img
                                src={`http://localhost:8080${item.image}`}
                                alt={item.taste}
                            />
                            <h3>{item.taste}</h3>
                            <p className="price">
                                {item.price.toLocaleString()}đ
                            </p>
                        </div>
                    ))}
                </Slider>
            </div>


            <div className="review-section">
                <h2>Đánh giá sản phẩm</h2>

                {/* ===== SUMMARY ===== */}
                <div className="review-summary">
                    <Rating
                        value={avgRate}
                        precision={0.5}
                        readOnly
                        icon={<FavoriteIcon fontSize="inherit" style={{ color: '#fe6a84' }} />}
                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" style={{ color: '#ccc' }} />}
                    />
                    <span className="review-score">
            {avgRate.toFixed(1)}/5
        </span>
                    <span className="review-count">
            ({reviews.length} đánh giá)
        </span>
                </div>

                {/* ===== FORM ===== */}
                <div className="review-form">
                    <h3>Viết đánh giá của bạn</h3>

                    {/* SELECT TASTE */}
                    <select
                        name="productTasteId"
                        value={reviewForm.productTasteId}
                        onChange={handleReviewChange}
                    >
                        <option value="">-- Chọn hương vị --</option>
                        {product.tastes.map(t => (
                            <option
                                key={t.productTasteId}
                                value={t.productTasteId}
                            >
                                {t.taste}
                            </option>
                        ))}
                    </select>

                    {/* RATE */}
                    <Rating
                        value={reviewForm.rate}
                        precision={1}              // ⭐ CHỈ CHO SỐ NGUYÊN
                        onChange={(e, value) =>
                            setReviewForm(prev => ({
                                ...prev,
                                rate: Number(value) // ⭐ đảm bảo là number nguyên
                            }))
                        }
                        icon={<FavoriteIcon fontSize="inherit" style={{ color: '#fe6a84' }} />}
                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" style={{ color: '#ccc' }} />}
                    />

                    <textarea
                        name="comment"
                        placeholder="Cảm nhận của bạn về sản phẩm..."
                        rows="4"
                        value={reviewForm.comment}
                        onChange={handleReviewChange}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setReviewImage(e.target.files[0])}
                    />

                    <button onClick={handleSubmitReview}>
                        Gửi đánh giá
                    </button>
                </div>

                {/* ===== LIST REVIEW ===== */}
                <div className="review-list">
                    {reviews.map((r, index) => (
                        <div key={index} className="review-item">

                            {/* ===== USER + RATE ===== */}
                            <div className="review-header">
                                <img
                                    src={
                                        r.avatar
                                            ? `http://localhost:8080${r.avatar}`
                                            : "https://via.placeholder.com/50"
                                    }
                                    alt="avatar"
                                    className="review-avatar"
                                />

                                <div className="review-user-info">
                                    <p className="review-username">{r.userName}</p>
                                    <p className="review-taste">Hương vị : {r.productTasteName}</p>
                                    <Rating
                                        value={r.rate}
                                        readOnly
                                        size="small"
                                        icon={<FavoriteIcon fontSize="inherit" style={{ color: '#fe6a84' }} />}
                                        emptyIcon={<FavoriteBorderIcon fontSize="inherit" style={{ color: '#ccc' }} />}
                                    />
                                </div>
                            </div>

                            {r.image && (
                                <img
                                    src={`http://localhost:8080${r.image}`}
                                    alt="review"
                                    className="review-image"
                                />
                            )}
                            <p className="review-comment">{r.comment}</p>
                            <p className="review-date">
                                {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                            </p>
                        </div>
                    ))}
                </div>

            </div>


            <Footer />
            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
                draggable
            />

        </div>

    );
}
