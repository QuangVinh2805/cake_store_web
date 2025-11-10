// src/components/HeroSection.js
import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            id: 1,
            image: './cake1.png',
            name: 'Chocolate Cherry Cupcake',
            description: 'Cupcake cherry chocolate là một loại bánh cupcake siêu ngon tuyệt hảo! Chúng có hương vị giống như những quả anh đào mà chúng ta đều yêu thích nhưng ở dạng bánh cupcake thân thiện với bữa tiệc! Ai có thể chống lại? Lựa chọn hoàn hảo cho Lễ tình nhân hoặc sinh nhật.'
        },
        {
            id: 2,
            image: './cake2.png',
            name: 'BlueBerry Cupcake',
            description: 'Cupcake việt quất là sự kết hợp hoàn hảo giữa vị ngọt dịu và chút chua nhẹ từ những trái việt quất mọng nước! Mỗi miếng bánh như một làn gió mát lành mùa hè, mang đến hương vị thanh mát và dễ chịu đến khó quên. Hoàn hảo để thưởng thức cùng trà chiều hoặc trong những buổi gặp mặt bạn bè thân thiết!'
        },
        {
            id: 3,
            image: './cake3.png',
            name: 'Chocolate Cupcake',
            description: 'Cupcake socola là món ngọt không bao giờ lỗi thời! Với lớp bánh mềm mịn, đậm vị cacao cùng lớp kem béo ngậy tan chảy trong miệng, đây chính là chiếc bánh dành cho những tín đồ socola đích thực. Phù hợp cho mọi dịp, từ chill một mình đến “treat yourself” sau một ngày dài!'
        },
        {
            id: 4,
            image: './cake4.png',
            name: 'Vanilla Cupcake',
            description: 'Cupcake vanilla mang đến hương thơm nhẹ nhàng, tinh tế từ chiết xuất vanilla nguyên chất. Lớp bánh bông xốp, mềm mịn như mây kết hợp với kem phủ ngọt ngào – đơn giản nhưng luôn chinh phục mọi khẩu vị. Lý tưởng để dùng trong các buổi tiệc trà hoặc sinh nhật nhẹ nhàng.'
        },
        {
            id: 5,
            image: './cake5.png',
            name: 'BlackBerry Cupcake',
            description: 'Cupcake mâm xôi là sự bùng nổ của hương vị! Vị chua chua ngọt ngọt đặc trưng từ quả mâm xôi tươi kết hợp cùng nền bánh mềm mịn tạo nên trải nghiệm vị giác cực kỳ cuốn hút. Một lựa chọn táo bạo và đầy cá tính cho những ai yêu thích vị trái cây tươi mát!'
        },
        {
            id: 6,
            image: './cake6.png',
            name: 'StrawBerry Cupcake',
            description: 'Cupcake dâu tây là biểu tượng của sự dễ thương và ngọt ngào! Với vị dâu chín mọng, hương thơm ngát và màu sắc bắt mắt, chiếc bánh này luôn là tâm điểm trong mọi buổi tiệc. Thích hợp cho các buổi hẹn hò, tiệc sinh nhật hoặc đơn giản là khi bạn muốn thêm chút tình yêu vào ngày thường.'
        },
        {
            id: 7,
            image: './cake7.png',
            name: 'Mint Cupcake',
            description: 'Cupcake bạc hà mang đến cảm giác mát lạnh sảng khoái như một làn gió nhẹ giữa trưa hè. Vị bánh dịu ngọt, hòa quyện cùng hương bạc hà tươi mát giúp đánh thức mọi giác quan. Đây là lựa chọn lý tưởng cho những ai yêu thích sự thanh khiết, nhẹ nhàng và đầy tinh tế. Hoàn hảo để bắt đầu ngày mới hoặc thư giãn sau giờ học, giờ làm!'
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const nextSlide = () => setCurrentSlide((currentSlide + 1) % slides.length);
    const prevSlide = () => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

    return (
        <section className="hero-section">
            <div className="container-slide hero-content">
                <div className="carousel-wrapper">
                    <div className={`slide slide-${slides[currentSlide].id}`}>
                        <img className="cake-image" src={slides[currentSlide].image} alt="cupcake" />
                        <div className="cake-right">
                            <p className="cake-name">{slides[currentSlide].name}</p>
                            <h3 className="cake-title">Những chiếc bánh ngọt ngào từ Sweet Dreams</h3>
                            <p className="cake-des">{slides[currentSlide].description}</p>
                            <button className={`cake-slide-order-${slides[currentSlide].id}`}>Đặt hàng ngay</button>
                        </div>
                    </div>
                </div>
                <div className="dots-container">
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        ></span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
