import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const LoginPage = () => {
  const { login, signup } = useApp();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    if (isSignUp) {
      const success = await signup(name, email, password, phone);
      if (success) {
        const user = await login(email, password);
        if (user) navigate('/dashboard');
      } else {
        setError('Signup failed. Email might already exist.');
      }
    } else {
      const user = await login(email, password);
      if (user) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side – decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{
        background: 'linear-gradient(135deg, var(--bg-dark) 0%, var(--bg-dark-accent) 50%, #4A2C1A 100%)'
      }}>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 30% 40%, var(--primary-gold) 0%, transparent 60%), radial-gradient(circle at 70% 70%, var(--primary-brown) 0%, transparent 50%)'
        }} />
        <div className="relative z-10 flex flex-col justify-center px-16">
          <div className="flex items-center gap-4 mb-12">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl" style={{
              background: 'var(--primary-gradient)'
            }}>✦</div>
            <div>
              <h1 className="text-white font-black text-3xl tracking-widest" style={{
                fontFamily: "'Playfair Display', serif"
              }}>HOLY</h1>
              <p className="text-xs tracking-widest" style={{ color: 'var(--primary-gold)' }}>RESTAURANT MANAGEMENT SYSTEM</p>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            {isSignUp ? (
              <>Join the <span style={{ color: 'var(--primary-gold)' }}>Holy</span> Family</>
            ) : (
              <>Welcome Back,<br /><span style={{ color: 'var(--primary-gold)' }}>Team!</span></>
            )}
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: 'var(--text-brown-muted)' }}>
            {isSignUp 
              ? 'Create an account to order online, make reservations, and earn rewards.' 
              : 'Manage your restaurant operations seamlessly. From table service to kitchen orders, inventory to reports — all in one place.'}
          </p>

          <div className="flex gap-2 mt-12">
            <div className="h-1 flex-1 rounded" style={{ background: 'var(--ethiopia-green)' }} />
            <div className="h-1 flex-1 rounded" style={{ background: 'var(--ethiopia-yellow)' }} />
            <div className="h-1 flex-1 rounded" style={{ background: 'var(--ethiopia-red)' }} />
          </div>
        </div>
      </div>

      {/* Right side – form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12" style={{ background: 'var(--bg-light-cream)' }}>
        <div className="w-full max-w-md">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 mb-8 text-sm font-medium transition-colors hover:opacity-70" style={{ color: 'var(--text-brown-muted)' }}>
            <ArrowLeft size={16} /> Back to Restaurant
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-black mb-2" style={{
              fontFamily: "'Playfair Display', serif",
              color: 'var(--bg-dark-accent)'
            }}>
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h2>
            <p style={{ color: 'var(--text-brown-muted)' }} className="text-sm">
              {isSignUp ? 'Sign up to order online and more' : 'Access your Holy Restaurant dashboard'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-brown-deep)' }}>Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="John Doe" 
                    required={isSignUp} 
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all" 
                    style={{
                      background: 'white',
                      border: '2px solid var(--bg-light-nude)',
                      color: 'var(--bg-dark-accent)'
                    }} 
                    onFocus={e => e.target.style.borderColor = 'var(--primary-gold)'} 
                    onBlur={e => e.target.style.borderColor = 'var(--bg-light-nude)'} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-brown-deep)' }}>Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="+251 900 0000" 
                    required={isSignUp} 
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all" 
                    style={{
                      background: 'white',
                      border: '2px solid var(--bg-light-nude)',
                      color: 'var(--bg-dark-accent)'
                    }} 
                    onFocus={e => e.target.style.borderColor = 'var(--primary-gold)'} 
                    onBlur={e => e.target.style.borderColor = 'var(--bg-light-nude)'} 
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-brown-deep)' }}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="your@email.com" 
                required 
                className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all" 
                style={{
                  background: 'white',
                  border: '2px solid var(--bg-light-nude)',
                  color: 'var(--bg-dark-accent)'
                }} 
                onFocus={e => e.target.style.borderColor = 'var(--primary-gold)'} 
                onBlur={e => e.target.style.borderColor = 'var(--bg-light-nude)'} 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-brown-deep)' }}>Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  required 
                  className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all pr-12" 
                  style={{
                    background: 'white',
                    border: '2px solid var(--bg-light-nude)',
                    color: 'var(--bg-dark-accent)'
                  }} 
                  onFocus={e => e.target.style.borderColor = 'var(--primary-gold)'} 
                  onBlur={e => e.target.style.borderColor = 'var(--bg-light-nude)'} 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-brown-muted)' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{
                background: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #FECACA'
              }}>
                {error}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 rounded-xl font-semibold text-sm tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-70" 
              style={{
                background: 'var(--primary-gradient)',
                color: 'white'
              }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? <><UserPlus size={18} /> Create Account</> : <><LogIn size={18} /> Sign In</>}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-brown-muted)' }}>
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button 
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }} 
                className="font-bold hover:underline transition-all" 
                style={{ color: 'var(--primary-gold)' }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: 'var(--text-brown-accent)' }}>
              Dire Dawa, Ethiopia • +251 25 111 2345
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;