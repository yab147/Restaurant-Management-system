import React from 'react';

const Experience = () => {
  const experiences = [
    {
      emoji: '🍛',
      title: 'Authentic Recipes',
      desc: 'Time-honored recipes passed through generations of Ethiopian families, prepared with love and the finest local ingredients.'
    },
    {
      emoji: '☕',
      title: 'Coffee Ceremony',
      desc: 'Experience the ancient Ethiopian buna ceremony — freshly roasted, ground, and brewed tableside for an unforgettable ritual.'
    },
    {
      emoji: '🌿',
      title: 'Natural Ingredients',
      desc: 'We source fresh, natural spices and produce from local Dire Dawa markets every morning to ensure peak freshness.'
    }
  ];

  return (
    <section className="py-24" style={{ background: 'var(--bg-dark-accent)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{ color: 'var(--primary-gold)' }}>
            THE HOLY EXPERIENCE
          </p>
          <h2 className="text-5xl font-black text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
            More Than a Meal
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {experiences.map((item, i) => (
            <div key={i} className="text-center p-8 rounded-3xl" style={{
              background: 'rgba(200,134,42,0.1)',
              border: '1px solid rgba(200,134,42,0.2)'
            }}>
              <div className="text-5xl mb-4">{item.emoji}</div>
              <h3 className="text-xl font-bold mb-3 text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                {item.title}
              </h3>
              <p className="leading-relaxed text-sm" style={{ color: 'var(--text-brown-accent)' }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
