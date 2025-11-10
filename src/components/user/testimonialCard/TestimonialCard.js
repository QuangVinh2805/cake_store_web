// src/components/TestimonialCard.js
import React from 'react';
import { Star } from 'lucide-react'; // Import icons here
import './TestimonialCard.css'; // Import the CSS file for this component

const TestimonialCard = ({ testimonial }) => {
    return (
        <div className="testimonial-card">
            <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="testimonial-avatar"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/E0E0E0/333333?text=Avatar"; }}
            />
            <h4 className="testimonial-name">{testimonial.name}</h4>
            <div className="testimonial-rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="star-icon star-filled" />
                ))}
                {[...Array(5 - testimonial.rating)].map((_, i) => (
                    <Star key={i} className="star-icon star-empty" />
                ))}
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
        </div>
    );
};

export default TestimonialCard;
