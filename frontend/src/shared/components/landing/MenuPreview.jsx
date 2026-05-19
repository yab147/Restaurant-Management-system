import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePublicMenuItems, usePublicMenuCategories } from '../../../features/menu/hooks/useMenu.js';
import Spinner from '../ui/Spinner.jsx';

/**
 * Landing menu — uses public API (no login). Shows photos from imageUrl.
 */
const MenuPreview = () => {
  const navigate = useNavigate();
  const [menuFilter, setMenuFilter] = useState(null);

  const { data: menuItems = [], isLoading: loadingItems } = usePublicMenuItems();
  const { data: menuCategories = [], isLoading: loadingCats } = usePublicMenuCategories();

  const isLoading = loadingItems || loadingCats;

  const filteredItems = useMemo(() => {
    const available = (menuItems || []).filter(i => i && i.availability);
    let list = menuFilter
      ? available.filter(i => i.categoryId === menuFilter)
      : available;
    list = [...list].sort((a, b) => {
      if (Boolean(b.isPopular) !== Boolean(a.isPopular)) return Number(b.isPopular) - Number(a.isPopular);
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
    return list.slice(0, 12);
  }, [menuItems, menuFilter]);

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
            Browse dishes from our live catalog — photos and prices update as our team refreshes the menu.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <button
            type="button"
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
            All dishes
          </button>
          {menuCategories.map(cat => (
            <button
              key={cat.categoryId}
              type="button"
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
              {cat.icon ? `${cat.icon} ` : ''}{cat.name}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.length === 0 ? (
              <div className="col-span-full text-center py-14 rounded-2xl" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
                <p className="text-lg font-semibold mb-2" style={{ color: '#2C1810' }}>Menu coming soon</p>
                <p className="text-sm" style={{ color: '#8B6E52' }}>Our team is updating the catalog. Check back shortly or sign in to explore more.</p>
              </div>
            ) : filteredItems.map(item => (
              <article key={item.itemId} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1" style={{ background: 'white' }}>
                <div className="h-48 relative bg-stone-100">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name || 'Menu item'} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl" style={{
                      background: 'linear-gradient(135deg, var(--bg-light-sand), var(--bg-light-tan))'
                    }}>🍽️</div>
                  )}
                  {item.isPopular && (
                    <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-semibold" style={{
                      background: 'var(--primary-gold)',
                      color: 'white'
                    }}>Popular</span>
                  )}
                  {item.isSpicy && <span className="absolute top-3 right-3 text-xs" title="Spicy">🌶️</span>}
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
                    {item.prepTime ? <span className="text-xs" style={{ color: 'var(--text-brown-accent)' }}>⏱ {item.prepTime} min</span> : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:scale-105"
            style={{
              background: 'var(--bg-dark-accent)',
              color: 'var(--text-white)'
            }}
          >
            Order online — sign in
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
