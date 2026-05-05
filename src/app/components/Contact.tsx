import { MapPin, Clock, Phone, Mail } from 'lucide-react';
import { useState } from 'react';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    { icon: MapPin, title: 'Location', content: 'Downtown Dire Dawa\nNear Kezira Market\nEthiopia' },
    { icon: Clock, title: 'Hours', content: 'Monday - Friday: 6:00 AM - 9:00 PM\nSaturday - Sunday: 7:00 AM - 10:00 PM' },
    { icon: Phone, title: 'Phone', content: '+251 25 XXX XXXX' },
    { icon: Mail, title: 'Email', content: 'info@holycafe.et' },
  ];

  return (
    <section id="contact" className="py-24 px-4 bg-gradient-to-b from-[#1f1612] to-[#2a1f1a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#d4a574]/10 border border-[#d4a574]/30 px-4 py-2 rounded-full mb-6">
            <span className="text-[#d4a574] text-sm">Get in Touch</span>
          </div>
          <h2 className="text-5xl text-[#f5e6d3] mb-4">Visit Us Today</h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {contactInfo.map((item, idx) => (
              <div key={idx} className="flex items-start gap-5 bg-[#1a120f] border border-[#3d2e27] p-6 rounded-xl hover:border-[#d4a574]/30 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#b8864e] rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-[#1a120f]" />
                </div>
                <div>
                  <h3 className="text-xl text-[#f5e6d3] mb-2">{item.title}</h3>
                  <p className="text-[#b8997a] whitespace-pre-line leading-relaxed">{item.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-[#1a120f] border border-[#3d2e27] rounded-2xl p-8">
            <h3 className="text-2xl text-[#f5e6d3] mb-6">Send us a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                required
                className="w-full px-5 py-4 bg-[#2a1f1a] border border-[#3d2e27] rounded-lg text-[#f5e6d3] placeholder-[#6a5a4d] focus:outline-none focus:border-[#d4a574] transition-all duration-300"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email"
                required
                className="w-full px-5 py-4 bg-[#2a1f1a] border border-[#3d2e27] rounded-lg text-[#f5e6d3] placeholder-[#6a5a4d] focus:outline-none focus:border-[#d4a574] transition-all duration-300"
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message"
                required
                rows={5}
                className="w-full px-5 py-4 bg-[#2a1f1a] border border-[#3d2e27] rounded-lg text-[#f5e6d3] placeholder-[#6a5a4d] focus:outline-none focus:border-[#d4a574] transition-all duration-300 resize-none"
              ></textarea>
              <button type="submit" className="w-full bg-gradient-to-r from-[#d4a574] to-[#b8864e] text-[#1a120f] py-4 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
