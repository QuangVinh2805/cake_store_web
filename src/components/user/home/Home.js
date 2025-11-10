// src/App.js
import React from 'react';
import Header from '../header/Header';
import HeroSection from '../heroSection/HeroSection';
import FeaturedProducts from '../featuredProducts/FeaturedProducts';
import QualityAssurance from '../qualityAssurance/QualityAssurance';
import CallToAction from '../callForOrder/CallForOrder';
import Testimonials from '../testimonials/Testimonials';
import Footer from '../footer/Footer';


export default function Home() {
    return (
        <div className="home-container">
            <Header />
            <main className="main-content">
                <HeroSection />
                <FeaturedProducts />
                <QualityAssurance />
                <CallToAction />
                <Testimonials />
            </main>
            <Footer />
        </div>
    );
}
