import React from 'react';

const About = () => {
  return (
    <section id="about" style={{ background: 'var(--bg-light-cream)' }} className="py-24">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{ color: 'var(--primary-gold)' }}>
            OUR STORY
          </p>
          <h2 className="text-5xl font-black mb-6 leading-tight" style={{
            fontFamily: "'Playfair Display', serif",
            color: 'var(--bg-dark-accent)'
          }}>
            A Taste of <br /><span style={{ color: 'var(--primary-gold)' }}>Ethiopia's Soul</span>
          </h2>
          <p className="mb-4 leading-relaxed" style={{ color: 'var(--text-brown-deep)' }}>
            Nestled in the vibrant city of Dire Dawa, Holy Restaurant has been a sanctuary of authentic Ethiopian cuisine for over 15 years. Founded by Chef Tigist Haile, our kitchen carries forward generations of culinary wisdom — from the art of brewing the perfect buna to the slow-simmered perfection of our Doro Wat.
          </p>
          <p className="mb-6 leading-relaxed" style={{ color: 'var(--text-brown-deep)' }}>
            Every dish tells a story. Every spice was chosen with intention. We believe food is more than sustenance — it is community, heritage, and love served on a platter of injera.
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['🧑🏾', '👩🏾', '🧑🏿', '👩🏿'].map((e, i) => (
                <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 border-white" style={{
                  background: 'var(--bg-light-nude)'
                }}>{e}</div>
              ))}
            </div>
            <div>
              <div className="flex text-yellow-500">{'★★★★★'}</div>
              <p className="text-xs" style={{ color: 'var(--text-brown-muted)' }}>Loved by thousands of guests</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl overflow-hidden shadow-2xl h-96">
            <img src="../../../assets/chef.webp" alt="Chef cooking" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-2xl p-5 shadow-xl" style={{
            background: 'var(--primary-gradient)',
            color: 'white'
          }}>
            <div className="text-3xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>15+</div>
            <div className="text-sm opacity-90">Years of Excellence</div>
          </div>
          <div className="absolute top-4 -right-4 flex flex-col gap-1 rounded-full overflow-hidden shadow-lg">
            <div className="w-3 h-8 rounded" style={{ background: 'var(--ethiopia-green)' }} />
            <div className="w-3 h-8 rounded" style={{ background: 'var(--ethiopia-yellow)' }} />
            <div className="w-3 h-8 rounded" style={{ background: 'var(--ethiopia-red)' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
