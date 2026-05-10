import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const heroImages = [
  '../../../assets/picc.jpg', 
  '../../../assets/dorowot.jpg',
  '../../../assets/drinks.webp',
  '../../../assets/pizza.jpeg',
  '../../../assets/drinks2.webp',
  '../../../assets/beyaynet.webp',
  '../../../assets/eggslice.webp'
];

const Hero = () => {
  const [currentHero, setCurrentHero] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {heroImages.map((img, i) => (
        <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{
          opacity: i === currentHero ? 1 : 0
        }}>
          <img src={img} alt="hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(to bottom, rgba(26,16,8,0.65) 0%, rgba(26,16,8,0.4) 50%, rgba(26,16,8,0.85) 100%)'
          }} />
        </div>
      ))}

      <div className="relative z-10 text-center px-6 max-w-4xl">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-0.5 w-12 rounded" style={{ background: 'var(--ethiopia-green)' }} />
          <div className="h-0.5 w-12 rounded" style={{ background: 'var(--ethiopia-yellow)' }} />
          <div className="h-0.5 w-12 rounded" style={{ background: 'var(--ethiopia-red)' }} />
        </div>

        <p className="text-sm tracking-[0.4em] mb-3 font-light" style={{ color: 'var(--primary-gold)' }}>
          DIRE DAWA, ETHIOPIA
        </p>

        <h1 className="text-7xl md:text-8xl font-black text-white mb-4 leading-none" style={{
          fontFamily: "'Playfair Display', serif",
          textShadow: '0 4px 30px rgba(0,0,0,0.5)'
        }}>
          HOLY
        </h1>
        <p className="text-2xl font-light mb-2" style={{
          color: 'var(--text-gold-light)',
          fontFamily: "'Playfair Display', serif"
        }}>
          Restaurant & Coffee House
        </p>
        <p className="text-base mb-10 max-w-xl mx-auto font-light leading-relaxed" style={{ color: 'var(--text-gold-muted)' }}>
          Authentic Ethiopian flavors crafted with tradition, served with warmth in the heart of Dire Dawa
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => scrollToSection('menu')} className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:scale-105 hover:shadow-2xl" style={{
            background: 'var(--primary-gradient)',
            color: 'var(--text-white)'
          }}>
            Explore Our Menu
          </button>
          <button onClick={() => scrollToSection('contact')} className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider border transition-all hover:bg-white hover:text-stone-900" style={{
            borderColor: 'var(--text-gold-light)',
            color: 'var(--text-gold-light)'
          }}>
            Make a Reservation
          </button>
        </div>
      </div>

      <button onClick={() => scrollToSection('about')} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
        <ChevronDown size={28} />
      </button>

      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
        {heroImages.map((_, i) => (
          <button key={i} onClick={() => setCurrentHero(i)} className="w-2 h-2 rounded-full transition-all" style={{
            background: i === currentHero ? 'var(--primary-gold)' : 'rgba(255,255,255,0.4)',
            transform: i === currentHero ? 'scale(1.4)' : 'scale(1)'
          }} />
        ))}
      </div>
    </section>
  );
};

export default Hero;
