import { Coffee } from 'lucide-react';

export function Header() {
  return (
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
  );
}
