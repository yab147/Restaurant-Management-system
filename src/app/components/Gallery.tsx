export function Gallery() {
  const images = [
    'https://images.unsplash.com/photo-1598554563873-55ef9dd8428b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    'https://images.unsplash.com/photo-1680006496105-ca00858f3c60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    'https://images.unsplash.com/photo-1692519722922-45fbbd3978ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    'https://images.unsplash.com/photo-1760307256225-59037ef0eb83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    'https://images.unsplash.com/photo-1646588283536-0afd2488078e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    'https://images.unsplash.com/photo-1603128901355-dec9bf904426?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  ];

  return (
    <section id="gallery" className="py-24 px-4 bg-[#1f1612]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block bg-[#d4a574]/10 border border-[#d4a574]/30 px-4 py-2 rounded-full mb-6">
            <span className="text-[#d4a574] text-sm">Moments</span>
          </div>
          <h2 className="text-5xl text-[#f5e6d3] mb-4">Our Gallery</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((img, idx) => (
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
  );
}
