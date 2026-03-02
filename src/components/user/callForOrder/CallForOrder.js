// src/components/CallForOrder.js
import React from 'react';
import './CallForOrder.css';
import {useNavigate} from "react-router-dom"; // Import the CSS file for this component

const CallForOrder = () => {
    const navigate = useNavigate();

    return (
        <section className="cta-section">
            <div className="container-cfo cta-content">
                <div className="cta-images">
                    <img
                        src="./cakeorder1.png"
                        alt="Bánh của tôi 1"
                        className="cta-image cta-image-1"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/E0E0E0/333333?text=Image+Error"; }}
                    />
                    <img
                        src="./cakeorder2.png"
                        alt="Bánh của tôi 2"
                        className="cta-image cta-image-2"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x300/E0E0E0/333333?text=Image+Error"; }}
                    />
                </div>
                <div className="cta-text-container">
                    <h2 className="cta-title">
                        Đặt bánh theo ý muốn của bạn
                    </h2>
                    <p className="cta-description">
                        Bạn có một ý tưởng độc đáo cho chiếc bánh? Hãy để chúng tôi biến giấc mơ ngọt ngào của bạn thành hiện thực. Chúng tôi nhận đặt làm bánh theo yêu cầu riêng, từ hương vị đến kiểu dáng.
                    </p>
                    <button className="cta-button" onClick={() => navigate("/product")}>
                        Đặt bánh ngay
                    </button>
                </div>
            </div>
        </section>
    );
};

export default CallForOrder;
