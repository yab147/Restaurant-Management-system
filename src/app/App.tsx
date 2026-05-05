import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { About } from './components/About';
import { Menu } from './components/Menu';
import { Gallery } from './components/Gallery';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-[#2a1f1a]">
      <Header />
      <Hero />
      <Stats />
      <About />
      <Menu />
      <Gallery />
      <Contact />
      <Footer />
    </div>
  );
}