import React, { useState } from 'react';
import './CheckOut.css';
import Header from '../header/Header';
import Footer from '../footer/Footer';

export default function Checkout() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        note: ''
    });

    const cartItems = [
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
    ];

    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Thông tin đơn hàng:", formData);
        alert("Đặt hàng thành công!");
    };

    return (
        <div className="checkout-main">
            <Header />
            <div className="checkout-container">
                <div className="checkout-left">
                    <h2>Thông tin giao hàng</h2>
                    <form className="checkout-form" onSubmit={handleSubmit}>
                        <label>Họ và tên</label>
                        <input type="text" name="name" placeholder="Nhập họ tên" value={formData.name} onChange={handleChange} required />

                        <label>Số điện thoại</label>
                        <input type="tel" name="phone" placeholder="Nhập số điện thoại" value={formData.phone} onChange={handleChange} required />

                        <label>Địa chỉ giao hàng</label>
                        <input type="text" name="address" placeholder="Nhập địa chỉ" value={formData.address} onChange={handleChange} required />

                        <label>Ghi chú</label>
                        <textarea name="note" placeholder="Ghi chú (nếu có)..." value={formData.note} onChange={handleChange} rows={3} />
                    </form>
                </div>

                <div className="checkout-right">
                    <h3>Đơn hàng của bạn</h3>
                    {cartItems.map(item => (
                        <div key={item.id} className="checkout-item">
                            <img src={item.image} alt={item.name} />
                            <div>
                                <p className="item-name">{item.name}</p>
                                <p className="item-quantity">x{item.quantity}</p>
                                <p className="item-price">{(item.price * item.quantity).toLocaleString()}đ</p>
                            </div>
                        </div>
                    ))}
                    <div className="checkout-summary">
                        <strong>Tổng cộng: {totalPrice.toLocaleString()}đ</strong>
                        <button type="submit" className="checkout-submit">Xác nhận đặt hàng</button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
