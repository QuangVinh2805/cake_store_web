// src/components/QualityAssurance.js
import React from 'react';
import './QualityAssurance.css'; // Import the CSS file for this component

const QualityAssurance = () => {
    return (
        <section className="quality-assurance-section">
            <div className="container-qa text-center">
                <h2 className="section-title-qa">Chất lượng luôn được ưu tiên hàng đầu</h2>
                <div className="quality-logo-container">
                    <div className="decorative-circles-grid">
                    </div>
                    <img
                        src="./logo.png"
                        alt="Sweet Dreams Logo"
                        className="quality-logo"
                    />
                </div>
                <p className="quality-description">
                    Cam kết về chất lượng sản phẩm là giá trị cốt lõi của chúng tôi. Mỗi nguyên liệu được lựa chọn kỹ lưỡng, mỗi công đoạn được thực hiện tỉ mỉ, để tạo ra những chiếc bánh không chỉ đẹp mắt mà còn thơm ngon, an toàn tuyệt đối.
                </p>
                <div className="quality-slogan">
                    Mỗi chiếc bánh là một tác phẩm nghệ thuật, được tạo ra từ tình yêu và niềm đam mê, mang đến trải nghiệm vị giác tuyệt vời nhất.
                </div>
            </div>
        </section>
    );
};

export default QualityAssurance;
