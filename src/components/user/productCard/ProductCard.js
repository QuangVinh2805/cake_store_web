import React from 'react';
import { Heart } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
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
                <button className="heart-icon-button">
                    <Heart className="heart-icon" />
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
