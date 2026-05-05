import { Coffee, Award, Star } from 'lucide-react';

export function Menu() {
  const coffeeItems = [
    { name: 'Traditional Ethiopian Coffee', price: '50 ETB', desc: 'Ceremony-style brewed coffee', featured: true },
    { name: 'Macchiato', price: '45 ETB', desc: 'Local favorite espresso drink' },
    { name: 'Cappuccino', price: '55 ETB', desc: 'Classic Italian style' },
    { name: 'Espresso', price: '40 ETB', desc: 'Pure and strong' },
    { name: 'Latte', price: '55 ETB', desc: 'Smooth and creamy' },
    { name: 'Americano', price: '45 ETB', desc: 'Bold and clean' },
  ];

  const foodItems = [
    { name: 'Fresh Pastries', price: '35 ETB', desc: 'Daily baked selection' },
    { name: 'Breakfast Combo', price: '120 ETB', desc: 'Coffee, bread, eggs, honey', featured: true },
    { name: 'Sandwiches', price: '80 ETB', desc: 'Fresh made to order' },
    { name: 'Cake Slice', price: '45 ETB', desc: 'Homemade varieties' },
    { name: 'Traditional Snacks', price: '40 ETB', desc: 'Kolo, popcorn, peanuts' },
    { name: 'Fresh Juice', price: '50 ETB', desc: 'Seasonal fruits' },
  ];

  return (
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
          <div className="bg-[#1a120f] border border-[#3d2e27] rounded-2xl p-8 hover:border-[#d4a574]/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#3d2e27]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#b8864e] rounded-full flex items-center justify-center">
                <Coffee className="w-6 h-6 text-[#1a120f]" />
              </div>
              <h3 className="text-3xl text-[#f5e6d3]">Coffee</h3>
            </div>
            <div className="space-y-6">
              {coffeeItems.map((item, idx) => (
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

          <div className="bg-[#1a120f] border border-[#3d2e27] rounded-2xl p-8 hover:border-[#d4a574]/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#3d2e27]">
              <div className="w-12 h-12 bg-gradient-to-br from-[#d4a574] to-[#b8864e] rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-[#1a120f]" />
              </div>
              <h3 className="text-3xl text-[#f5e6d3]">Food & Snacks</h3>
            </div>
            <div className="space-y-6">
              {foodItems.map((item, idx) => (
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
  );
}
