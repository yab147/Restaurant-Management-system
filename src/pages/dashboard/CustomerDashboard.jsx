import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const CustomerDashboard = () => {
  const { menuItems, orders, currentUser } = useApp();
  const navigate = useNavigate();
  const popularItems = menuItems.filter(i => i.isPopular).slice(0, 6);

  return (
    <div className="p-6 space-y-6">
      <div className="rounded-2xl p-6" style={{
        background: 'linear-gradient(135deg, var(--bg-dark), var(--bg-dark-accent))',
        border: '1px solid rgba(200,134,42,0.2)'
      }}>
        <h2 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
          Welcome to Holy Restaurant! 🍛
        </h2>
        <p style={{ color: 'var(--text-brown-muted)' }}>Explore our menu, make reservations, or check your orders</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Browse Menu', icon: '🍽️', path: 'menu', color: 'var(--primary-gold)', bg: '#FEF9EE' },
          { label: 'Reservations', icon: '📅', path: 'reservations', color: '#0369A1', bg: '#EFF6FF' },
          { label: 'My Orders', icon: '📋', path: 'orders', color: '#059669', bg: '#ECFDF5' }
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={() => navigate(item.path)} 
            className="p-5 rounded-2xl text-center transition-all hover:scale-105 shadow-sm" 
            style={{ background: item.bg }}
          >
            <div className="text-4xl mb-2">{item.icon}</div>
            <div className="font-semibold text-sm" style={{ color: item.color }}>{item.label}</div>
          </button>
        ))}
      </div>

      <h3 className="font-bold text-lg" style={{
        color: 'var(--bg-dark-accent)',
        fontFamily: "'Playfair Display', serif"
      }}>⭐ Today's Highlights</h3>
      
      <div className="grid md:grid-cols-3 gap-4">
        {popularItems.map(item => (
          <div key={item.itemId} className="rounded-2xl overflow-hidden shadow-sm" style={{
            background: 'white',
            border: '1px solid #F0E8DE'
          }}>
            <div className="h-32 flex items-center justify-center text-5xl" style={{
              background: 'linear-gradient(135deg, var(--bg-light-sand), var(--bg-light-tan))'
            }}>
              🍛
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm" style={{
                color: 'var(--bg-dark-accent)',
                fontFamily: "'Playfair Display', serif"
              }}>{item.name}</h4>
              <p className="text-xs mb-2 line-clamp-1" style={{ color: 'var(--text-brown-muted)' }}>{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold" style={{ color: 'var(--primary-gold)' }}>ETB {item.price}</span>
                {item.isSpicy && <span className="text-xs">🌶️ Spicy</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerDashboard;
