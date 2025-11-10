// src/components/Testimonials.js
import React, { useState, useEffect } from 'react';
import TestimonialCard from '../testimonialCard/TestimonialCard'; // Import TestimonialCard
import './Testimonials.css'; // Import the CSS file for this component

// Mock Testimonial Data (moved here as it's used only by Testimonials)
const mockTestimonials = [
    {
        id: 1,
        name: "Nguyễn Thị Thảo",
        avatar: "https://placehold.co/80x80/FFB6C1/8B0000?text=NTT",
        text: "Bánh ở đây thực sự rất ngon và đẹp mắt. Tôi đã đặt nhiều lần cho các dịp đặc biệt và luôn hài lòng. Dịch vụ cũng rất tuyệt vời!",
        rating: 5
    },
    {
        id: 2,
        name: "Trần Văn Hùng",
        avatar: "https://placehold.co/80x80/ADD8E6/00008B?text=TVH",
        text: "Tôi rất ấn tượng với sự sáng tạo trong từng chiếc bánh. Hương vị độc đáo, không quá ngọt và rất tinh tế. Chắc chắn sẽ quay lại!",
        rating: 4
    },
    {
        id: 3,
        name: "Lê Thu Phương",
        avatar: "https://placehold.co/80x80/D8BFD8/4B0082?text=LTP",
        text: "Giao hàng nhanh chóng và bánh được đóng gói cẩn thận. Chiếc bánh sinh nhật cho con gái tôi thật sự là điểm nhấn của buổi tiệc. Cảm ơn Sweet Dreams!",
        rating: 5
    },
    {
        id: 4,
        name: "Phạm Anh Tuấn",
        avatar: "https://placehold.co/80x80/CFCFC4/000000?text=PAT",
        text: "Giá cả phải chăng cho chất lượng tuyệt hảo. Tôi thường xuyên mua bánh ngọt ở đây để thưởng thức cùng gia đình vào cuối tuần.",
        rating: 4
    }
];

const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(1); // Default to 1 for small screens

    // Function to determine how many cards should be visible based on screen width
    const getVisibleCards = () => {
        if (window.innerWidth >= 1024) return 3; // lg: grid-cols-3
        if (window.innerWidth >= 768) return 2;  // md: grid-cols-2
        return 1; // Default: grid-cols-1
    };

    // Update visibleCards on mount and resize
    useEffect(() => {
        const handleResize = () => {
            setVisibleCards(getVisibleCards());
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = mockTestimonials.length - visibleCards;
            return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = mockTestimonials.length - visibleCards;
            return prevIndex <= 0 ? maxIndex : prevIndex - 1;
        });
    };


    return (
        <section className="testimonials-section">
            <div className="container-testi">
                <h2 className="section-title-testi">Phản hồi từ khách hàng của chúng tôi</h2>
                <div className="testimonial-carousel-container">
                    <button
                        onClick={prevTestimonial}
                        className="carousel-button carousel-button-left"
                    >
                        &lt;
                    </button>
                    <div className="carousel-track-container">
                        <div
                            className="carousel-track"
                            // Calculate transform based on visibleCards and currentIndex
                            style={{
                                transform: `translateX(-${(100 / mockTestimonials.length) * currentIndex}%)`,
                                width: `${(mockTestimonials.length / visibleCards) * 100}%`
                            }}
                        >
                            {mockTestimonials.map((testimonial) => (
                                <div key={testimonial.id} className="carousel-card-wrapper" style={{ width: `${100 / mockTestimonials.length}%` }}>
                                    <TestimonialCard testimonial={testimonial} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={nextTestimonial}
                        className="carousel-button carousel-button-right"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
