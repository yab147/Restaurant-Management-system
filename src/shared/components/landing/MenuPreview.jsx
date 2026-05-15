import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';

const MenuPreview = () => {
  const { menuItems, menuCategories } = useApp();
  const [menuFilter, setMenuFilter] = useState(null);
  const navigate = useNavigate();

  const filteredItems = menuFilter 
    ? menuItems.filter(i => i.categoryId === menuFilter).slice(0, 8) 
    : menuItems.filter(i => i.isPopular).slice(0, 8);

  return (
    <section id="menu" className="py-24" style={{ background: 'var(--bg-light-almond)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{ color: 'var(--primary-gold)' }}>
            WHAT WE SERVE
          </p>
          <h2 className="text-5xl font-black mb-4" style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--bg-dark-accent)'
          }}>
            Our Menu
          </h2>
          <p style={{ color: 'var(--text-brown-muted)' }} className="max-w-xl mx-auto">
            Explore the rich tapestry of Ethiopian flavors, from hearty wots to refreshing beverages.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button 
            onClick={() => setMenuFilter(null)} 
            className="px-5 py-2 rounded-full text-sm font-medium transition-all" 
            style={menuFilter === null ? {
              background: 'var(--primary-gradient)',
              color: 'white'
            } : {
              background: 'white',
              color: 'var(--text-brown-muted)',
              border: '1px solid var(--text-gold-light)'
            }}
          >
            ⭐ Popular
          </button>
          {menuCategories.map(cat => (
            <button 
              key={cat.categoryId} 
              onClick={() => setMenuFilter(cat.categoryId)} 
              className="px-5 py-2 rounded-full text-sm font-medium transition-all" 
              style={menuFilter === cat.categoryId ? {
                background: 'var(--primary-gradient)',
                color: 'white'
              } : {
                background: 'white',
                color: 'var(--text-brown-muted)',
                border: '1px solid var(--text-gold-light)'
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map(item => (
            <div key={item.itemId} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1" style={{ background: 'white' }}>
              <div className="h-44 relative flex items-center justify-center text-6xl" style={{
                background: 'linear-gradient(135deg, var(--bg-light-sand), var(--bg-light-tan))'
              }}>
                {menuCategories.find(c => c.categoryId === item.categoryId)?.icon || '🍽️'}
                {item.isPopular && (
                  <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-semibold" style={{
                    background: 'var(--primary-gold)',
                    color: 'white'
                  }}>Popular</span>
                )}
                {item.isSpicy && <span className="absolute top-3 right-3 text-xs">🌶️</span>}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-base mb-1" style={{
                  color: 'var(--bg-dark-accent)',
                  fontFamily: "'Playfair Display', serif"
                }}>
                  {item.name}
                </h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: 'var(--text-brown-muted)' }}>{item.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: 'var(--primary-gold)' }}>ETB {item.price}</span>
                  {item.prepTime && <span className="text-xs" style={{ color: 'var(--text-brown-accent)' }}>⏱ {item.prepTime} min</span>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <button 
            onClick={() => navigate('/login')} 
            className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:scale-105" 
            style={{
              background: 'var(--bg-dark-accent)',
              color: 'var(--text-white)'
            }}
          >
            Order Online → Login as Customer
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
