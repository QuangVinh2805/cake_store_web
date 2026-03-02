import React from 'react';
import './ProductCard.css';
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const navigate = useNavigate();

    const handleProductClick = () => {
        const productId = product.productHashId || product.id;
        navigate(`/product/${productId}`);
    };

    return (
        <div className="product-card" onClick={handleProductClick}>
            <div className="product-image-container">
                <img
                    src={
                        product.image?.startsWith('http')
                            ? product.image
                            : `http://localhost:8080${product.image}`
                    }
                    alt={product.productName || product.name}
                    className="product-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                            "https://placehold.co/200x200/E0E0E0/333333?text=Image+Error";
                    }}
                />

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

            <h4 className="product-name">
                {product.productName || product.name}
            </h4>

            <p className="product-price">
                {product.price.toLocaleString()}
            </p>

            <div className="product-actions">
                <button
                    className="add-to-cart-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleProductClick();
                    }}
                >
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
