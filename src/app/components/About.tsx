import { Coffee, Award } from 'lucide-react';

export function About() {
  return (
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
  );
}
