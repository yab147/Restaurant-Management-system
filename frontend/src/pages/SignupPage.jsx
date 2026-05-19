// SignupPage.jsx - COMPLETELY MATCHES LOGIN PAGE LAYOUT
import React, { useState } from 'react';
import { Eye, EyeOff, ArrowLeft, UserPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/index.jsx';
import { ROUTES } from '../constants/routes.js';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const SignupPage = () => {
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pwd) => {
    return {
      minLength: pwd.length >= 8,
      hasUppercase: /[A-Z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd)
    };
  };

  const isPasswordValid = () => {
    const validation = validatePassword(password);
    return validation.minLength && validation.hasUppercase && validation.hasNumber;
  };

  const passwordValidation = validatePassword(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid()) {
      setError('Password must be at least 8 characters with 1 uppercase letter and 1 number');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const res = await signup(name, email, password, phone);
    if (res.success) {
      const loginRes = await login(email, password);
      if (loginRes.success) {
        navigate(ROUTES.DASHBOARD);
      }
    } else {
      setError(res.error || 'Signup failed. Email might already exist.');
    }
    setLoading(false);
  };

  return (
    <>
      <style>
        {`
          .phone-input-custom input {
            width: 100%;
            padding: 14px 16px;
            border-radius: 12px;
            font-size: 14px;
            outline: none;
            transition: all 0.2s;
            background: white;
            border: 2px solid var(--bg-light-nude);
            color: var(--bg-dark-accent);
          }
          .phone-input-custom input:focus {
            border-color: var(--primary-gold);
          }
          .phone-input-custom .PhoneInputCountry {
            margin-right: 8px;
          }
          .phone-input-custom .PhoneInputCountrySelect {
            border: none;
            background: transparent;
            cursor: pointer;
          }
          .phone-input-custom .PhoneInputCountrySelectArrow {
            color: var(--text-brown-muted);
          }
        `}
      </style>
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
              Join the <span style={{ color: 'var(--primary-gold)' }}>Holy</span> Family
            </h2>
            <p className="mb-10 leading-relaxed" style={{ color: 'var(--text-brown-muted)' }}>
              Create an account to order online, make reservations, and earn rewards.
            </p>

            <div className="flex gap-2 mt-12">
              <div className="h-1 flex-1 rounded" style={{ background: 'var(--ethiopia-green)' }} />
              <div className="h-1 flex-1 rounded" style={{ background: 'var(--ethiopia-yellow)' }} />
              <div className="h-1 flex-1 rounded" style={{ background: 'var(--ethiopia-red)' }} />
            </div>
          </div>
        </div>

        {/* Right side – form - EXACT same as Login page */}
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
                Create Account
              </h2>
              <p style={{ color: 'var(--text-brown-muted)' }} className="text-sm">
                Sign up to order online and more
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-brown-deep)' }}>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe"
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
                <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-brown-deep)' }}>Phone Number</label>
                <PhoneInput
                  international
                  defaultCountry="ET"
                  value={phone}
                  onChange={setPhone}
                  className="phone-input-custom"
                />
              </div>

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
                {password && (
                  <div className="mt-2 space-y-1 text-xs">
                    <div style={{ color: passwordValidation.minLength ? 'var(--ethiopia-green)' : 'var(--text-brown-muted)' }}>
                      {passwordValidation.minLength ? '✓' : '○'} At least 8 characters
                    </div>
                    <div style={{ color: passwordValidation.hasUppercase ? 'var(--ethiopia-green)' : 'var(--text-brown-muted)' }}>
                      {passwordValidation.hasUppercase ? '✓' : '○'} 1 uppercase letter (A-Z)
                    </div>
                    <div style={{ color: passwordValidation.hasNumber ? 'var(--ethiopia-green)' : 'var(--text-brown-muted)' }}>
                      {passwordValidation.hasNumber ? '✓' : '○'} 1 number (0-9)
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 tracking-wider uppercase" style={{ color: 'var(--text-brown-deep)' }}>Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3.5 rounded-xl text-sm outline-none transition-all pr-12"
                    style={{
                      background: 'white',
                      border: confirmPassword && password !== confirmPassword ? '2px solid #DC2626' : '2px solid var(--bg-light-nude)',
                      color: 'var(--bg-dark-accent)'
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary-gold)'}
                    onBlur={e => e.target.style.borderColor = confirmPassword && password !== confirmPassword ? '#DC2626' : 'var(--bg-light-nude)'}
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-brown-muted)' }}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <div className="mt-1 text-xs" style={{ color: '#DC2626' }}>
                    ✗ Passwords do not match
                  </div>
                )}
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
                  <><UserPlus size={18} /> Create Account</>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm" style={{ color: 'var(--text-brown-muted)' }}>
                Already have an account?{" "}
                <Link to="/login" className="font-bold hover:underline transition-all" style={{ color: 'var(--primary-gold)' }}>
                  Sign In
                </Link>
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
    </>
  );
};

export default SignupPage;