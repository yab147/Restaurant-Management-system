import React from 'react';
import { Utensils, Users, Coffee, Award } from 'lucide-react';

const StatsStrip = () => {
  const stats = [
    { icon: <Utensils size={24} />, value: '80+', label: 'Menu Items' },
    { icon: <Users size={24} />, value: '200+', label: 'Happy Guests Daily' },
    { icon: <Coffee size={24} />, value: '15+', label: 'Years of Service' },
    { icon: <Award size={24} />, value: '4.9★', label: 'Guest Rating' }
  ];

  return (
    <section style={{ background: 'var(--bg-dark)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <div className="flex justify-center mb-2" style={{ color: 'var(--primary-gold)' }}>
              {stat.icon}
            </div>
            <div className="text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {stat.value}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-brown-muted)' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsStrip;
