import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {

    console.log("Product data received:", product);
    const [isFavourite, setIsFavourite] = useState(product.isFavourite || false);
    const [loading, setLoading] = useState(false);

    const handleToggleFavourite = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const token = localStorage.getItem("token"); // 🔑 token lưu sẵn khi login
            if (!token) {
                alert("Bạn cần đăng nhập để yêu thích sản phẩm!");
                setLoading(false);
                return;
            }

            console.log("Sending toggleFavourite:", { token, hashId: product.hashId });

            const response = await fetch("http://localhost:8080/api/products/favourite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token: token,
                    hashId: product.id,
                }),
            });

            if (!response.ok) {
                throw new Error("Lỗi khi gọi API yêu thích");
            }

            const data = await response.json();
            setIsFavourite(data.status === 1); // 💖 Cập nhật UI theo status từ backend
        } catch (error) {
            console.error("Toggle favourite failed:", error);
            alert("Có lỗi khi thao tác yêu thích!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="product-card">
            <div className="product-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/200x200/E0E0E0/333333?text=Image+Error";
                    }}
                />

                {/* Icon Heart ở góc phải */}
                <button
                    className={`heart-icon-button ${isFavourite ? 'favourite' : ''}`}
                    onClick={handleToggleFavourite}
                    disabled={loading}
                >
                    <Heart className={`heart-icon ${isFavourite ? 'filled' : ''}`} />
                </button>

                {product.tags && product.tags.length > 0 && (
                    <div className="product-tags">
                        {product.tags.map(tag => (
                            <span key={tag} className="product-tag">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            <h4 className="product-name">{product.name}</h4>
            <p className="product-price">{product.price} VNĐ</p>

            <div className="product-actions">
                <button className="add-to-cart-button">
                    Thêm vào giỏ
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
