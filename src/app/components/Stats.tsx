import { Award, Users, Star } from 'lucide-react';

export function Stats() {
  const stats = [
    { icon: Award, label: 'Premium Coffee', value: '100%' },
    { icon: Users, label: 'Happy Customers', value: '5000+' },
    { icon: Star, label: 'Years of Excellence', value: '6+' },
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-[#2a1f1a] to-[#1f1612]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#2a1f1a] border border-[#3d2e27] rounded-xl p-8 text-center hover:border-[#d4a574]/50 transition-all duration-300">
            <stat.icon className="w-12 h-12 text-[#d4a574] mx-auto mb-4" />
            <p className="text-4xl text-[#f5e6d3] mb-2">{stat.value}</p>
            <p className="text-[#b8997a]">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
