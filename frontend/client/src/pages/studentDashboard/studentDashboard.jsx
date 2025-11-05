import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'; 
import Nav from '../../components/layout/Nav';
import './StudentDashboard.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import img1 from '../../assets/7d1640147d4ad93311317fdd9d658b5c.jpg';
import img2 from '../../assets/52a026cf9dc0a00311326764c772ae6a.jpg';
import img3 from '../../assets/Awesome 4K Tech Wallpapers - WallpaperAccess.jpeg';
import img4 from '../../assets/b3be3a3d7253c5e0d796574cae5a3391.jpg';
import img5 from '../../assets/dcfc8550fd4d0b676fb1ec023eb68844.jpg';

const heroImages = [img1, img2, img3, img4, img5];

export default function StudentDashboard() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex(currentIndex === heroImages.length - 1 ? 0 : currentIndex + 1);
  };
  const prevSlide = () => {
    setCurrentIndex(currentIndex === 0 ? heroImages.length - 1 : currentIndex - 1);
  };

  // 1. FIX: Timer leak and stale closure resolved.
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []); 

  return (
    <div>
      <Nav />
      
      <main className="page-content">

        <section className="hero-slider">
          <div className="hero-image-container">
            {/* 2. FIX: Use index as key */}
            {heroImages.map((src, index) => (
              <img key={index} src={src} alt={`Slide ${index + 1}`} className={index === currentIndex ? "hero-image active" : "hero-image"}/>
            ))}
          </div>
          <div className="hero-content">
            <h1>Welcome, Student!</h1>
            <p>Explore hackathons and connect with the community.</p>
          </div>
          {}
          <button onClick={prevSlide} className="slider-btn prev-btn">‹</button>
          <button onClick={nextSlide} className="slider-btn next-btn">›</button>
        </section>

        <section className="cta-section">
          
          <Link to="/" className="cta-link-wrapper">
            <div className="cta-left">
              <div className="cta-plus-button">+</div>
              <p className="cta-text">Add your ideas</p>
            </div>
          </Link>
          
        </section>

        <div style={{ height: '1000px', padding: '2rem' }}>
          <h2>Dashboard Content</h2>
          <p>Scroll down to see the Navbar effect...</p>
        </div>
        
      </main>
    </div>
  );
}