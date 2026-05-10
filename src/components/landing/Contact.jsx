import React from 'react';
import { MapPin, Phone, Clock, Star } from 'lucide-react';

const Contact = () => {
  const contactInfo = [
    { icon: <MapPin size={18} />, label: 'Address', value: 'Kezira Area, Dire Dawa, Ethiopia' },
    { icon: <Phone size={18} />, label: 'Phone', value: '+251 25 111 2345' },
    { icon: <Clock size={18} />, label: 'Hours', value: 'Mon–Sun: 6:30 AM – 10:30 PM' },
    { icon: <Star size={18} />, label: 'Rating', value: '4.9/5 – Highly Recommended' }
  ];

  return (
    <section id="contact" className="py-24" style={{ background: 'var(--bg-dark)' }}>
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{ color: 'var(--primary-gold)' }}>
            FIND US
          </p>
          <h2 className="text-5xl font-black text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Visit Us in<br /><span style={{ color: 'var(--primary-gold)' }}>Dire Dawa</span>
          </h2>
          <div className="space-y-4">
            {contactInfo.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{
                background: 'rgba(200,134,42,0.08)',
                border: '1px solid rgba(200,134,42,0.15)'
              }}>
                <div style={{ color: 'var(--primary-gold)' }}>{item.icon}</div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-brown-muted)' }}>{item.label}</p>
                  <p className="text-sm text-white font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 rounded-3xl" style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(200,134,42,0.2)'
        }}>
          <h3 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Book a Table
          </h3>
          <div className="space-y-4">
            {[
              { placeholder: 'Your Full Name', type: 'text' },
              { placeholder: 'Phone Number', type: 'tel' },
              { placeholder: 'Date & Time', type: 'datetime-local' },
              { placeholder: 'Number of Guests', type: 'number' }
            ].map((field, i) => (
              <input 
                key={i} 
                type={field.type} 
                placeholder={field.placeholder} 
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" 
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(200,134,42,0.25)',
                  color: 'white'
                }} 
              />
            ))}
            <button 
              className="w-full py-4 rounded-xl font-semibold tracking-wider transition-all hover:scale-105" 
              style={{
                background: 'var(--primary-gradient)',
                color: 'white'
              }} 
              onClick={() => alert('Reservation request submitted! We will call you to confirm.')}
            >
              Request Reservation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
