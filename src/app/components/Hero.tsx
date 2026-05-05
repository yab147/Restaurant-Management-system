import { Star } from 'lucide-react';

export function Hero() {
  return (
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
  );
}
