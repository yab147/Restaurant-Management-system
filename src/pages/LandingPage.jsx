import React from 'react';
import Navbar from '../shared/components/landing/Navbar';
import Hero from '../shared/components/landing/Hero';
import StatsStrip from '../shared/components/landing/StatsStrip';
import About from '../shared/components/landing/About';
import MenuPreview from '../shared/components/landing/MenuPreview';
import Experience from '../shared/components/landing/Experience';
import Testimonials from '../shared/components/landing/Testimonials';
import Contact from '../shared/components/landing/Contact';
import Footer from '../shared/components/landing/Footer';

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