import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{
      background: 'var(--bg-dark-transparent)',
      backdropFilter: 'blur(12px)'
    }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{
          background: 'var(--primary-gradient)'
        }}>
          ✦
        </div>
        <div>
          <h1 className="text-white font-bold text-xl tracking-widest" style={{
            fontFamily: "'Playfair Display', serif"
          }}>
            HOLY
          </h1>
          <p className="text-xs tracking-widest" style={{
            color: 'var(--primary-gold)'
          }}>RESTAURANT</p>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {['Home', 'Menu', 'About', 'Contact'].map(item => (
          <button 
            key={item} 
            onClick={() => scrollToSection(item.toLowerCase())} 
            className="text-sm tracking-wider transition-colors hover:text-amber-400" 
            style={{ color: 'var(--text-gold-light)' }}
          >
            {item}
          </button>
        ))}
      </div>

      <button 
        onClick={() => navigate('/login')} 
        className="px-5 py-2 rounded-full text-sm font-semibold tracking-wider transition-all hover:scale-105" 
        style={{
          background: 'var(--primary-gradient)',
          color: 'var(--text-white)'
        }}
      >
        Sign Up | Login
      </button>
    </nav>
  );
};

export default Navbar;
