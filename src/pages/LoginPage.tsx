import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, LogIn } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface LoginPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

const roleCredentials: { role: UserRole; email: string; password: string; label: string; emoji: string; color: string }[] = [
  { role: 'admin', email: 'admin@holy.et', password: 'admin123', label: 'Admin', emoji: '👑', color: '#7C3AED' },
  { role: 'manager', email: 'manager@holy.et', password: 'manager123', label: 'Manager', emoji: '📊', color: '#0369A1' },
  { role: 'waiter', email: 'waiter@holy.et', password: 'waiter123', label: 'Waiter', emoji: '🍽️', color: '#059669' },
  { role: 'chef', email: 'chef@holy.et', password: 'chef123', label: 'Chef', emoji: '👨‍🍳', color: '#D97706' },
  { role: 'cashier', email: 'cashier@holy.et', password: 'cashier123', label: 'Cashier', emoji: '💰', color: '#DC2626' },
  { role: 'customer', email: 'guest@holy.et', password: 'guest123', label: 'Customer', emoji: '🧑‍🤝‍🧑', color: '#C8862A' },
];

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onSuccess }) => {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const user = login(email, password);
    setLoading(false);
    if (user) {
      onSuccess();
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const fillCredentials = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    setError('');
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left side – decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1A1008 0%, #2C1810 50%, #4A2C1A 100%)' }}>
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, #C8862A 0%, transparent 60%), radial-gradient(circle at 70% 70%, #8B3A0F 0%, transparent 50%)' }} />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>✦</div>
            <div>
              <h1 className="text-white font-black text-3xl tracking-widest" style={{ fontFamily: "'Playfair Display', serif" }}>HOLY</h1>
              <p className="text-xs tracking-widest" style={{ color: '#C8862A' }}>RESTAURANT MANAGEMENT SYSTEM</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Welcome Back,<br /><span style={{ color: '#C8862A' }}>Team!</span>
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: '#8B6E52' }}>
            Manage your restaurant operations seamlessly. From table service to kitchen orders, inventory to reports — all in one place.
          </p>

          {/* Role cards */}
          <div className="grid grid-cols-2 gap-3">
            {roleCredentials.map(role => (
              <button key={role.role} onClick={() => fillCredentials(role.email, role.password)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-2xl">{role.emoji}</span>
                <div>
                  <p className="text-white text-xs font-semibold">{role.label}</p>
                  <p className="text-xs" style={{ color: '#6B4F3A' }}>Click to fill</p>
                </div>
              </button>
            ))}
          </div>

          {/* Ethiopian flag accent */}
          <div className="flex gap-2 mt-12">
            <div className="h-1 flex-1 rounded" style={{ background: '#078930' }} />
            <div className="h-1 flex-1 rounded" style={{ background: '#FCDD09' }} />
            <div className="h-1 flex-1 rounded" style={{ background: '#DA121A' }} />
          </div>
        </div>
      </div>

      {/* Right side – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12"
        style={{ background: '#FDF6EE' }}>
        <div className="w-full max-w-md">
          <button onClick={onBack} className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: '#8B6E52' }}>
            <ArrowLeft size={16} /> Back to Restaurant
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-black mb-2" style={{ fontFamily: "'Playfair Display', serif", color: '#2C1810' }}>
              Sign In
            </h2>
            <p style={{ color: '#8B6E52' }} className="text-sm">Access your Holy Restaurant dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: '#6B4F3A' }}>
                Email Address
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com" required
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                style={{ background: 'white', border: '2px solid #E8D5C0', color: '#2C1810' }}
                onFocus={e => e.target.style.borderColor = '#C8862A'}
                onBlur={e => e.target.style.borderColor = '#E8D5C0'} />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: '#6B4F3A' }}>
                Password
              </label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all pr-12"
                  style={{ background: 'white', border: '2px solid #E8D5C0', color: '#2C1810' }}
                  onFocus={e => e.target.style.borderColor = '#C8862A'}
                  onBlur={e => e.target.style.borderColor = '#E8D5C0'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#8B6E52' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: '#FEE2E2', color: '#DC2626', border: '1px solid #FECACA' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-xl font-semibold text-sm tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} /> Sign In to Dashboard
                </>
              )}
            </button>
          </form>

          {/* Quick role access mobile */}
          <div className="mt-8 lg:hidden">
            <p className="text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: '#8B6E52' }}>Quick Login As:</p>
            <div className="grid grid-cols-3 gap-2">
              {roleCredentials.map(role => (
                <button key={role.role} onClick={() => fillCredentials(role.email, role.password)}
                  className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                  style={{ background: 'white', border: '1px solid #E8D5C0', color: '#6B4F3A' }}>
                  <span className="text-xl">{role.emoji}</span>
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: '#B0926A' }}>
              Dire Dawa, Ethiopia • +251 25 111 2345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
