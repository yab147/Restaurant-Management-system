import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const navLinks = ['Home', 'Menu', 'About', 'Contact'];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4" style={{
      background: 'var(--bg-dark-transparent)',
      backdropFilter: 'blur(12px)'
    }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
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

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(item => (
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

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="hidden sm:block px-5 py-2 rounded-full text-sm font-semibold tracking-wider transition-all hover:scale-105" 
            style={{
              background: 'var(--primary-gradient)',
              color: 'var(--text-white)'
            }}
          >
          Login
          </button>

          <button 
            onClick={() => navigate('/signup')} 
            className="hidden sm:block px-5 py-2 rounded-full text-sm font-semibold tracking-wider transition-all hover:scale-105" 
            style={{
              background: 'var(--primary-gradient)',
              color: 'var(--text-white)'
            }}
          >
          Signup
          </button>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-1"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 py-6 px-6 space-y-4 shadow-2xl animate-in slide-in-from-top duration-300" style={{
          background: 'var(--bg-dark)',
          borderTop: '1px solid rgba(200,134,42,0.1)'
        }}>
          {navLinks.map(item => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())} 
              className="block w-full text-left text-base tracking-widest py-2 border-b border-white/5" 
              style={{ color: 'var(--text-gold-light)' }}
            >
              {item}
            </button>
          ))}
          <button 
            onClick={() => navigate('/login')} 
            className="w-full py-4 rounded-xl text-center font-bold tracking-widest mt-4" 
            style={{
              background: 'var(--primary-gradient)',
              color: 'var(--text-white)'
            }}
          >
            LOGIN / SIGNUP
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
