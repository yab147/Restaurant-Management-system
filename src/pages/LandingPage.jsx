import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import StatsStrip from '../components/landing/StatsStrip';
import About from '../components/landing/About';
import MenuPreview from '../components/landing/MenuPreview';
import Experience from '../components/landing/Experience';
import Testimonials from '../components/landing/Testimonials';
import Contact from '../components/landing/Contact';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-light-cream)' }}>
      <Navbar />
      <Hero />
      <StatsStrip />
      <About />
      <MenuPreview />
      <Experience />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default LandingPage;