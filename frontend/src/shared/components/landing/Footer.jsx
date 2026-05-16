import React from 'react';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-dark-deep)' }} className="py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{
            background: 'var(--primary-gradient)'
          }}>✦</div>
          <span className="text-white font-bold tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>
            HOLY RESTAURANT
          </span>
        </div>
        <div className="flex gap-2">
          <div className="w-6 h-2 rounded" style={{ background: 'var(--ethiopia-green)' }} />
          <div className="w-6 h-2 rounded" style={{ background: 'var(--ethiopia-yellow)' }} />
          <div className="w-6 h-2 rounded" style={{ background: 'var(--ethiopia-red)' }} />
        </div>
        <p className="text-xs" style={{ color: 'var(--text-footer)' }}>
          © 2025 Holy Restaurant, Dire Dawa, Ethiopia. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
