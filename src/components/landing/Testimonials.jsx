import React from 'react';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Selam M.',
      city: 'Dire Dawa',
      text: "The Doro Wat here is simply the best I've ever had. The spices, the injera, the whole experience feels like home. Holy is truly special!",
      stars: 5
    },
    {
      name: 'Ahmed K.',
      city: 'Harar',
      text: 'I drive 45 minutes just for their Ethiopian coffee ceremony. Nothing else comes close. The atmosphere is warm and the staff are so welcoming.',
      stars: 5
    },
    {
      name: 'Liya T.',
      city: 'Addis Ababa',
      text: 'Visited Holy on a business trip and was blown away. The Beyaynetu combo platter was incredible — so many flavors working in perfect harmony.',
      stars: 5
    }
  ];

  return (
    <section className="py-24" style={{ background: 'var(--bg-light-cream)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{ color: 'var(--primary-gold)' }}>
            GUEST REVIEWS
          </p>
          <h2 className="text-5xl font-black" style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--bg-dark-accent)'
          }}>
            What People Say
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div key={i} className="p-6 rounded-2xl shadow-md" style={{ background: 'white' }}>
              <div className="flex text-yellow-500 mb-3">{'★'.repeat(review.stars)}</div>
              <p className="text-sm mb-4 italic leading-relaxed" style={{ color: 'var(--text-brown-deep)' }}>
                "{review.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{
                  background: 'var(--primary-gradient)'
                }}>
                  {review.name[0]}
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: 'var(--bg-dark-accent)' }}>{review.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-brown-muted)' }}>{review.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
