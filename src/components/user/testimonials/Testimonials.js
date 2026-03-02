// src/components/Testimonials.js
import React, { useState, useEffect } from 'react';
import TestimonialCard from '../testimonialCard/TestimonialCard';
import './Testimonials.css';
import axios from 'axios';

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleCards, setVisibleCards] = useState(1);

    // 👇 Responsive cards
    const getVisibleCards = () => {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    };

    useEffect(() => {
        const handleResize = () => {
            setVisibleCards(getVisibleCards());
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ✅ CALL API REVIEWS
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(
                    'http://localhost:8080/api/reviews/latest'
                );

                // Map BE → FE format
                const mappedData = res.data.map((item) => ({
                    id: item.reviewId,
                    name: item.userName,
                    avatar: item.userAvatar
                        ? `http://localhost:8080${item.userAvatar}`
                        : '',
                    text: item.comment,
                    rating: item.rate
                }));

                setTestimonials(mappedData);
            } catch (err) {
                console.error('Lỗi khi load reviews:', err);
            }
        };

        fetchReviews();
    }, []);

    const nextTestimonial = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = testimonials.length - visibleCards;
            return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
    };

    const prevTestimonial = () => {
        setCurrentIndex((prevIndex) => {
            const maxIndex = testimonials.length - visibleCards;
            return prevIndex <= 0 ? maxIndex : prevIndex - 1;
        });
    };

    if (testimonials.length === 0) return null;

    return (
        <section className="testimonials-section">
            <div className="container-testi">
                <h2 className="section-title-testi">
                    Phản hồi từ khách hàng của chúng tôi
                </h2>

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
                            style={{
                                transform: `translateX(-${(100 / testimonials.length) * currentIndex}%)`,
                                width: `${(testimonials.length / visibleCards) * 100}%`
                            }}
                        >
                            {testimonials.map((testimonial) => (
                                <div
                                    key={testimonial.id}
                                    className="carousel-card-wrapper"
                                    style={{ width: `${100 / testimonials.length}%` }}
                                >
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
