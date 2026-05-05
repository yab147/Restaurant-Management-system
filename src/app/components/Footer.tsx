import { Coffee } from 'lucide-react';

export function Footer() {
  return (
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
  );
}
