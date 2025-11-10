import React, { useState } from 'react';
import './Cart.css';
import Header from "../header/Header"
import Footer from "../footer/Footer"
import { FiTrash2 } from 'react-icons/fi';

export default function Cart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Bánh ngọt dâu',
            price: 50000,
            quantity: 2,
            image: '/banhgiadinh1.png'
        },
        {
            id: 2,
            name: 'Bánh chocolate',
            price: 65000,
            quantity: 1,
            image: '/banhgiadinh1.png'
        }
    ]);

    const handleQuantityChange = (id, delta) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item
            )
        );
    };

    const handleRemove = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <div className="cart-main">
            <Header/>
            <hr width="100%"/>
            <div className="cart-container">
                <h2>Giỏ hàng của bạn</h2>
                {cartItems.length === 0 ? (
                    <p>Giỏ hàng đang trống.</p>
                ) : (
                    <>
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item">
                                <img src={item.image} alt={item.name}/>
                                <div className="cart-item-info">
                                    <div className="cart-item-header">
                                        <h3>{item.name}</h3>
                                        <button className="remove-button" onClick={() => handleRemove(item.id)}>
                                            <FiTrash2 size={20}/>
                                        </button>
                                    </div>
                                    <p>Giá: {item.price.toLocaleString()}đ</p>
                                    <div className="quantity-control">
                                        <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="cart-summary">
                            <h3>Tổng cộng: {totalPrice.toLocaleString()}đ</h3>
                            <button className="checkout-button">Thanh toán</button>
                        </div>
                    </>
                )}
            </div>
            <Footer/>
        </div>
    );
}
