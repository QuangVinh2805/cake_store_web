import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HeroSection.css';
import {useNavigate} from "react-router-dom";

const API = "http://localhost:8080/api/banners";

const HeroSection = () => {
    const navigate = useNavigate();
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);

    /* ===== FETCH BANNERS ===== */
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await axios.get(`${API}/getAllByStatus?status=1`);

                const mappedSlides = res.data.map(b => ({
                    id: b.id,
                    name: b.productName,
                    description: b.description,
                    image: b.image?.startsWith("http")
                        ? b.image
                        : `http://localhost:8080${b.image}`,
                    background: b.background,
                    colorButton: b.colorButton
                }));

                setSlides(mappedSlides);
            } catch (err) {
                console.error("Không tải được banner");
            }
        };

        fetchBanners();
    }, []);

    /* ===== AUTO SLIDE ===== */
    useEffect(() => {
        if (slides.length === 0) return;

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    if (slides.length === 0) return null;

    const nextSlide = () =>
        setCurrentSlide((currentSlide + 1) % slides.length);

    const prevSlide = () =>
        setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);

    const slide = slides[currentSlide];

    return (
        <section className="hero-section">
            <div className="container-slide hero-content">
                <div className="carousel-wrapper">
                    <div
                        className="slide"
                        style={{
                            background: slide.background
                        }}
                    >
                        <img
                            className="cake-image"
                            src={slide.image}
                            alt={slide.name}
                        />

                        <div className="cake-right">
                            <p className="cake-name">{slide.name}</p>
                            <h3 className="cake-title">
                                Những chiếc bánh ngọt ngào từ Sweet Dreams
                            </h3>
                            <p className="cake-des">{slide.description}</p>

                            <button
                                className="cake-slide-order"
                                style={{
                                    color: slide.colorButton,
                                    borderColor: slide.colorButton
                                }}
                                onClick={() => navigate("/product")}
                            >
                                Đặt hàng ngay
                            </button>
                        </div>
                    </div>
                </div>

                {/* DOTS */}
                <div className="dots-container">
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
