import { Coffee, MapPin, Clock, Phone, Mail, Star, Award, Users } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#2a1f1a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-[#1a120f]/95 backdrop-blur-md shadow-lg z-50 border-b border-[#3d2e27]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#b8864e] rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-[#1a120f]" />
              </div>
              <div>
                <span className="text-2xl text-[#f5e6d3] tracking-wide">Holy Cafe</span>
                <p className="text-xs text-[#b8864e]">Dire Dawa</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-10">
              <a href="#home" className="text-[#d4a574] hover:text-[#f5e6d3] transition-all duration-300">Home</a>
              <a href="#about" className="text-[#d4a574] hover:text-[#f5e6d3] transition-all duration-300">About</a>
              <a href="#menu" className="text-[#d4a574] hover:text-[#f5e6d3] transition-all duration-300">Menu</a>
              <a href="#gallery" className="text-[#d4a574] hover:text-[#f5e6d3] transition-all duration-300">Gallery</a>
              <a href="#contact" className="text-[#d4a574] hover:text-[#f5e6d3] transition-all duration-300">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1774529233247-d3f34ed11994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920"
            alt="Ethiopian Coffee Ceremony"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a120f]/80 via-[#2a1f1a]/70 to-[#2a1f1a]"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 bg-[#3d2e27]/60 backdrop-blur-sm px-6 py-2 rounded-full border border-[#d4a574]/30">
            <Star className="w-4 h-4 text-[#d4a574]" fill="#d4a574" />
            <span className="text-[#f5e6d3] text-sm">Authentic Ethiopian Experience</span>
          </div>
          <h1 className="text-6xl md:text-8xl mb-6 text-[#f5e6d3] tracking-tight">Holy Cafe</h1>
          <p className="text-xl md:text-3xl mb-3 text-[#d4a574]">Dire Dawa, Ethiopia</p>
          <p className="text-lg md:text-xl text-[#b8997a] max-w-2xl mx-auto leading-relaxed">
            Where tradition meets excellence in every cup
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#menu" className="bg-gradient-to-r from-[#d4a574] to-[#b8864e] text-[#1a120f] px-8 py-4 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              Explore Menu
            </a>
            <a href="#contact" className="bg-[#3d2e27] text-[#f5e6d3] px-8 py-4 rounded-lg border border-[#d4a574]/30 hover:bg-[#4d3e37] transition-all duration-300">
              Visit Us
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#2a1f1a] to-[#1f1612]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Award, label: 'Premium Coffee', value: '100%' },
            { icon: Users, label: 'Happy Customers', value: '5000+' },
            { icon: Star, label: 'Years of Excellence', value: '6+' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-[#2a1f1a] border border-[#3d2e27] rounded-xl p-8 text-center hover:border-[#d4a574]/50 transition-all duration-300">
              <stat.icon className="w-12 h-12 text-[#d4a574] mx-auto mb-4" />
              <p className="text-4xl text-[#f5e6d3] mb-2">{stat.value}</p>
              <p className="text-[#b8997a]">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 bg-[#1f1612]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="inline-block bg-[#d4a574]/10 border border-[#d4a574]/30 px-4 py-2 rounded-full mb-6">
                <span className="text-[#d4a574] text-sm">Our Story</span>
              </div>
              <h2 className="text-5xl text-[#f5e6d3] mb-6">Experience Ethiopian Coffee Heritage</h2>
              <p className="text-[#b8997a] mb-6 leading-relaxed text-lg">
                Holy Cafe is a sanctuary for coffee lovers in Dire Dawa. We honor the ancient Ethiopian coffee tradition
                while crafting modern favorites with precision and care.
              </p>
              <p className="text-[#b8997a] leading-relaxed text-lg mb-8">
                Every bean is sourced from the finest Ethiopian highlands, roasted to perfection, and prepared with
                the passion that only generations of coffee culture can inspire.
              </p>
              <div className="flex gap-4">
                <div className="flex-1 bg-[#2a1f1a] border border-[#3d2e27] p-6 rounded-lg">
                  <Coffee className="w-8 h-8 text-[#d4a574] mb-3" />
                  <p className="text-[#f5e6d3] mb-1">Premium Beans</p>
                  <p className="text-sm text-[#8a7355]">Sourced locally</p>
                </div>
                <div className="flex-1 bg-[#2a1f1a] border border-[#3d2e27] p-6 rounded-lg">
                  <Award className="w-8 h-8 text-[#d4a574] mb-3" />
                  <p className="text-[#f5e6d3] mb-1">Expert Baristas</p>
                  <p className="text-sm text-[#8a7355]">Trained craftsmen</p>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1770579673873-8da37e35d54e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                  alt="Coffee brewing equipment"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a120f]/60 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-br from-[#d4a574] to-[#b8864e] w-32 h-32 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-24 px-4 bg-gradient-to-b from-[#1f1612] to-[#2a1f1a]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#d4a574]/10 border border-[#d4a574]/30 px-4 py-2 rounded-full mb-6">
              <span className="text-[#d4a574] text-sm">Our Offerings</span>
            </div>
            <h2 className="text-5xl text-[#f5e6d3] mb-4">Signature Menu</h2>
            <p className="text-[#b8997a] text-lg max-w-2xl mx-auto">
              Carefully crafted beverages and fresh bites to complement your coffee experience
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Coffee Menu */}
            <div className="bg-[#1a120f] border border-[#3d2e27] rounded-2xl p-8 hover:border-[#d4a574]/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#3d2e27]">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#b8864e] rounded-full flex items-center justify-center">
                  <Coffee className="w-6 h-6 text-[#1a120f]" />
                </div>
                <h3 className="text-3xl text-[#f5e6d3]">Coffee</h3>
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Traditional Ethiopian Coffee', price: '50 ETB', desc: 'Ceremony-style brewed coffee', featured: true },
                  { name: 'Macchiato', price: '45 ETB', desc: 'Local favorite espresso drink' },
                  { name: 'Cappuccino', price: '55 ETB', desc: 'Classic Italian style' },
                  { name: 'Espresso', price: '40 ETB', desc: 'Pure and strong' },
                  { name: 'Latte', price: '55 ETB', desc: 'Smooth and creamy' },
                  { name: 'Americano', price: '45 ETB', desc: 'Bold and clean' },
                ].map((item, idx) => (
                  <div key={idx} className={`pb-6 border-b border-[#3d2e27]/50 ${item.featured ? 'bg-[#d4a574]/5 -mx-4 px-4 py-4 rounded-lg' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[#f5e6d3] text-lg">{item.name}</p>
                          {item.featured && <Star className="w-4 h-4 text-[#d4a574]" fill="#d4a574" />}
                        </div>
                        <p className="text-sm text-[#8a7355] mt-1">{item.desc}</p>
                      </div>
                      <span className="text-[#d4a574] text-lg ml-4">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Food & Snacks */}
            <div className="bg-[#1a120f] border border-[#3d2e27] rounded-2xl p-8 hover:border-[#d4a574]/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#3d2e27]">
                <div className="w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#b8864e] rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#1a120f]" />
                </div>
                <h3 className="text-3xl text-[#f5e6d3]">Food & Snacks</h3>
              </div>
              <div className="space-y-6">
                {[
                  { name: 'Fresh Pastries', price: '35 ETB', desc: 'Daily baked selection' },
                  { name: 'Breakfast Combo', price: '120 ETB', desc: 'Coffee, bread, eggs, honey', featured: true },
                  { name: 'Sandwiches', price: '80 ETB', desc: 'Fresh made to order' },
                  { name: 'Cake Slice', price: '45 ETB', desc: 'Homemade varieties' },
                  { name: 'Traditional Snacks', price: '40 ETB', desc: 'Kolo, popcorn, peanuts' },
                  { name: 'Fresh Juice', price: '50 ETB', desc: 'Seasonal fruits' },
                ].map((item, idx) => (
                  <div key={idx} className={`pb-6 border-b border-[#3d2e27]/50 ${item.featured ? 'bg-[#d4a574]/5 -mx-4 px-4 py-4 rounded-lg' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-[#f5e6d3] text-lg">{item.name}</p>
                          {item.featured && <Star className="w-4 h-4 text-[#d4a574]" fill="#d4a574" />}
                        </div>
                        <p className="text-sm text-[#8a7355] mt-1">{item.desc}</p>
                      </div>
                      <span className="text-[#d4a574] text-lg ml-4">{item.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-24 px-4 bg-[#1f1612]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-[#d4a574]/10 border border-[#d4a574]/30 px-4 py-2 rounded-full mb-6">
              <span className="text-[#d4a574] text-sm">Moments</span>
            </div>
            <h2 className="text-5xl text-[#f5e6d3] mb-4">Our Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              'https://images.unsplash.com/photo-1598554563873-55ef9dd8428b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
              'https://images.unsplash.com/photo-1680006496105-ca00858f3c60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
              'https://images.unsplash.com/photo-1692519722922-45fbbd3978ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
              'https://images.unsplash.com/photo-1760307256225-59037ef0eb83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
              'https://images.unsplash.com/photo-1646588283536-0afd2488078e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
              'https://images.unsplash.com/photo-1603128901355-dec9bf904426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
            ].map((img, idx) => (
              <div key={idx} className="aspect-square overflow-hidden rounded-xl border border-[#3d2e27] hover:border-[#d4a574]/50 transition-all duration-300 group">
                <img
                  src={img}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
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
              {[
                { icon: MapPin, title: 'Location', content: 'Downtown Dire Dawa\nNear Kezira Market\nEthiopia' },
                { icon: Clock, title: 'Hours', content: 'Monday - Friday: 6:00 AM - 9:00 PM\nSaturday - Sunday: 7:00 AM - 10:00 PM' },
                { icon: Phone, title: 'Phone', content: '+251 25 XXX XXXX' },
                { icon: Mail, title: 'Email', content: 'info@holycafe.et' },
              ].map((item, idx) => (
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
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-5 py-4 bg-[#2a1f1a] border border-[#3d2e27] rounded-lg text-[#f5e6d3] placeholder-[#6a5a4d] focus:outline-none focus:border-[#d4a574] transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-5 py-4 bg-[#2a1f1a] border border-[#3d2e27] rounded-lg text-[#f5e6d3] placeholder-[#6a5a4d] focus:outline-none focus:border-[#d4a574] transition-all duration-300"
                />
                <textarea
                  placeholder="Your Message"
                  rows={5}
                  className="w-full px-5 py-4 bg-[#2a1f1a] border border-[#3d2e27] rounded-lg text-[#f5e6d3] placeholder-[#6a5a4d] focus:outline-none focus:border-[#d4a574] transition-all duration-300 resize-none"
                ></textarea>
                <button className="w-full bg-gradient-to-r from-[#d4a574] to-[#b8864e] text-[#1a120f] py-4 rounded-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a120f] border-t border-[#3d2e27] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-[#d4a574] to-[#b8864e] rounded-full flex items-center justify-center">
                <Coffee className="w-5 h-5 text-[#1a120f]" />
              </div>
              <span className="text-2xl text-[#f5e6d3]">Holy Cafe</span>
            </div>
            <p className="text-[#8a7355] mb-6 max-w-md">
              Serving the finest Ethiopian coffee in Dire Dawa with passion and tradition since 2020
            </p>
            <div className="w-full border-t border-[#3d2e27] pt-6 mt-6">
              <p className="text-[#6a5a4d] text-sm">
                &copy; 2026 Holy Cafe. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}