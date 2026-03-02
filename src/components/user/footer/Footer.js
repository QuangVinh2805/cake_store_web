// src/components/Footer.js
import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-wave">
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path d="M0,64 C360,0 1080,150 1440,64 L1440,0 L0,0 Z" fill="#ffffff" />
                </svg>
            </div>

            <div className="container-footer footer-grid">
                {/* Cột 1: Thương hiệu */}
                <div>
                    <h4 className="footer-heading">
                        <p className="footer-logo-pink">Sweet Dreams</p>
                    </h4>
                    <p className="footer-description">
                        Nơi những giấc mơ ngọt ngào trở thành hiện thực qua từng chiếc bánh.
                    </p>
                    <div className="social-icons">
                        <div className="social-icon-circle">FB</div>
                        <div className="social-icon-circle">IG</div>
                        <div className="social-icon-circle">X</div>
                    </div>
                </div>

                {/* Cột 2: Liên kết nhanh */}
                <div>
                    <h4 className="footer-heading">Liên kết nhanh</h4>
                    <ul className="footer-links">
                        <li><a href="#" className="footer-link-item">Trang chủ</a></li>
                        <li><a href="#" className="footer-link-item">Sản phẩm</a></li>
                        <li><a href="#" className="footer-link-item">Liên hệ</a></li>
                        <li><a href="#" className="footer-link-item">Đơn hàng của bạn</a></li>
                    </ul>
                </div>

                {/* Cột 3: Chính sách */}
                <div>
                    <h4 className="footer-heading">Sản phẩm</h4>
                    <ul className="footer-links">
                        <li><a href="#" className="footer-link-item">Bánh gato</a></li>
                        <li><a href="#" className="footer-link-item">Bánh gia đình</a></li>
                        <li><a href="#" className="footer-link-item">Bánh mỳ</a></li>
                    </ul>
                </div>

                {/* Cột 4: Liên hệ */}
                <div>
                    <h4 className="footer-heading">Cơ sở</h4>
                    <p className="contact-info">Cs1 : 123 Đường Phạm Văn Đồng,Hà Nội</p>
                    <p className="contact-info">Cs2 : 123 Đường Xuân Đỉnh,Hà Nội</p>
                </div>
            </div>

            <div className="footer-copyright">
                &copy; Sweet Dreams. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
