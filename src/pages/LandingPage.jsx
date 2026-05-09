import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Star, ChevronDown, Utensils, Coffee, Users, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
const heroImages = ['../../assets/picc.jpg', '../../assets/doro.webp','../../assets/drinks.webp','../../assets/pizza.jpeg','../../assets/drinks2.webp','../../assets/beyaynet.webp'];
const LandingPage = ({
  onLoginClick
}) => {
  const {
    menuItems,
    menuCategories
  } = useApp();
  const [currentHero, setCurrentHero] = useState(0);
  const [menuFilter, setMenuFilter] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHero(prev => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  const popularItems = menuItems.filter(i => i.isPopular).slice(0, 6);
  const filteredItems = menuFilter ? menuItems.filter(i => i.categoryId === menuFilter).slice(0, 8) : menuItems.filter(i => i.isPopular).slice(0, 8);
  const scrollToSection = id => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <div className="min-h-screen" style={{
    fontFamily: "'Inter', sans-serif"
  }}>
      {/* ───── NAVBAR ───── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4" style={{
      background: 'rgba(26,16,8,0.85)',
      backdropFilter: 'blur(12px)'
    }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl" style={{
          background: 'linear-gradient(135deg, #C8862A, #8B3A0F)'
        }}>
            ✦
          </div>
          <div>
            <h1 className="text-white font-bold text-xl tracking-widest" style={{
            fontFamily: "'Playfair Display', serif"
          }}>
              HOLY
            </h1>
            <p className="text-xs tracking-widest" style={{
            color: '#C8862A'
          }}>RESTAURANT</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Menu', 'About', 'Contact'].map(item => <button key={item} onClick={() => scrollToSection(item.toLowerCase())} className="text-sm tracking-wider transition-colors hover:text-amber-400" style={{
          color: '#D4B896'
        }}>
              {item}
            </button>)}
        </div>

        <button onClick={onLoginClick} className="px-5 py-2 rounded-full text-sm font-semibold tracking-wider transition-all hover:scale-105" style={{
        background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
        color: '#FFF8F0'
      }}>
          Sign Up  |   Login
        </button>
      </nav>

      {/* ───── HERO ───── */}
      <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroImages.map((img, i) => <div key={i} className="absolute inset-0 transition-opacity duration-1000" style={{
        opacity: i === currentHero ? 1 : 0
      }}>
            <img src={img} alt="hero" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{
          background: 'linear-gradient(to bottom, rgba(26,16,8,0.65) 0%, rgba(26,16,8,0.4) 50%, rgba(26,16,8,0.85) 100%)'
        }} />
          </div>)}

        <div className="relative z-10 text-center px-6 max-w-4xl">
          {/* Ethiopian flag colors accent */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="h-0.5 w-12 rounded" style={{
            background: '#078930'
          }} />
            <div className="h-0.5 w-12 rounded" style={{
            background: '#FCDD09'
          }} />
            <div className="h-0.5 w-12 rounded" style={{
            background: '#DA121A'
          }} />
          </div>

          <p className="text-sm tracking-[0.4em] mb-3 font-light" style={{
          color: '#C8862A'
        }}>
            DIRE DAWA, ETHIOPIA
          </p>

          <h1 className="text-7xl md:text-8xl font-black text-white mb-4 leading-none" style={{
          fontFamily: "'Playfair Display', serif",
          textShadow: '0 4px 30px rgba(0,0,0,0.5)'
        }}>
            HOLY
          </h1>
          <p className="text-2xl font-light mb-2" style={{
          color: '#D4B896',
          fontFamily: "'Playfair Display', serif"
        }}>
            Restaurant & Coffee House
          </p>
          <p className="text-base mb-10 max-w-xl mx-auto font-light leading-relaxed" style={{
          color: '#B8A08A'
        }}>
            Authentic Ethiopian flavors crafted with tradition, served with warmth in the heart of Dire Dawa
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => scrollToSection('menu')} className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:scale-105 hover:shadow-2xl" style={{
            background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
            color: '#FFF8F0'
          }}>
              Explore Our Menu
            </button>
            <button onClick={() => scrollToSection('contact')} className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider border transition-all hover:bg-white hover:text-stone-900" style={{
            borderColor: '#D4B896',
            color: '#D4B896'
          }}>
              Make a Reservation
            </button>
          </div>
        </div>

        <button onClick={() => scrollToSection('about')} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white animate-bounce">
          <ChevronDown size={28} />
        </button>

        {/* Hero dots */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2">
          {heroImages.map((_, i) => <button key={i} onClick={() => setCurrentHero(i)} className="w-2 h-2 rounded-full transition-all" style={{
          background: i === currentHero ? '#C8862A' : 'rgba(255,255,255,0.4)',
          transform: i === currentHero ? 'scale(1.4)' : 'scale(1)'
        }} />)}
        </div>
      </section>

      {/* ───── STATS STRIP ───── */}
      <section style={{
      background: '#1A1008'
    }}>
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[{
          icon: <Utensils size={24} />,
          value: '80+',
          label: 'Menu Items'
        }, {
          icon: <Users size={24} />,
          value: '200+',
          label: 'Happy Guests Daily'
        }, {
          icon: <Coffee size={24} />,
          value: '15+',
          label: 'Years of Service'
        }, {
          icon: <Award size={24} />,
          value: '4.9★',
          label: 'Guest Rating'
        }].map((stat, i) => <div key={i} className="text-center">
              <div className="flex justify-center mb-2" style={{
            color: '#C8862A'
          }}>{stat.icon}</div>
              <div className="text-3xl font-bold text-white" style={{
            fontFamily: "'Playfair Display', serif"
          }}>{stat.value}</div>
              <div className="text-sm" style={{
            color: '#8B6E52'
          }}>{stat.label}</div>
            </div>)}
        </div>
      </section>

      {/* ───── ABOUT ───── */}
      <section id="about" style={{
      background: '#FDF6EE'
    }} className="py-24">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{
            color: '#C8862A'
          }}>OUR STORY</p>
            <h2 className="text-5xl font-black mb-6 leading-tight" style={{
            fontFamily: "'Playfair Display', serif",
            color: '#2C1810'
          }}>
              A Taste of <br /><span style={{
              color: '#C8862A'
            }}>Ethiopia's Soul</span>
            </h2>
            <p className="mb-4 leading-relaxed" style={{
            color: '#6B4F3A'
          }}>
              Nestled in the vibrant city of Dire Dawa, Holy Restaurant has been a sanctuary of authentic Ethiopian cuisine for over 15 years. Founded by Chef Tigist Haile, our kitchen carries forward generations of culinary wisdom — from the art of brewing the perfect buna to the slow-simmered perfection of our Doro Wat.
            </p>
            <p className="mb-6 leading-relaxed" style={{
            color: '#6B4F3A'
          }}>
              Every dish tells a story. Every spice was chosen with intention. We believe food is more than sustenance — it is community, heritage, and love served on a platter of injera.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {['🧑🏾', '👩🏾', '🧑🏿', '👩🏿'].map((e, i) => <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 border-white" style={{
                background: '#E8D5C0'
              }}>{e}</div>)}
              </div>
              <div>
                <div className="flex text-yellow-500">{'★★★★★'}</div>
                <p className="text-xs" style={{
                color: '#8B6E52'
              }}>Loved by thousands of guests</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl h-96">
              <img src="https://images.pexels.com/photos/36073022/pexels-photo-36073022.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=600" alt="Chef cooking" className="w-full h-full object-cover" />
            </div>
            {/* Decorative card */}
            <div className="absolute -bottom-6 -left-6 rounded-2xl p-5 shadow-xl" style={{
            background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
            color: 'white'
          }}>
              <div className="text-3xl font-black" style={{
              fontFamily: "'Playfair Display', serif"
            }}>15+</div>
              <div className="text-sm opacity-90">Years of Excellence</div>
            </div>
            {/* Ethiopian flag colors bar */}
            <div className="absolute top-4 -right-4 flex flex-col gap-1 rounded-full overflow-hidden shadow-lg">
              <div className="w-3 h-8 rounded" style={{
              background: '#078930'
            }} />
              <div className="w-3 h-8 rounded" style={{
              background: '#FCDD09'
            }} />
              <div className="w-3 h-8 rounded" style={{
              background: '#DA121A'
            }} />
            </div>
          </div>
        </div>
      </section>

      {/* ───── MENU PREVIEW ───── */}
      <section id="menu" className="py-24" style={{
      background: '#FAF0E6'
    }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{
            color: '#C8862A'
          }}>WHAT WE SERVE</p>
            <h2 className="text-5xl font-black mb-4" style={{
            fontFamily: "'Playfair Display', serif",
            color: '#2C1810'
          }}>
              Our Menu
            </h2>
            <p style={{
            color: '#8B6E52'
          }} className="max-w-xl mx-auto">
              Explore the rich tapestry of Ethiopian flavors, from hearty wots to refreshing beverages.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button onClick={() => setMenuFilter(null)} className="px-5 py-2 rounded-full text-sm font-medium transition-all" style={menuFilter === null ? {
            background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
            color: 'white'
          } : {
            background: 'white',
            color: '#8B6E52',
            border: '1px solid #D4B896'
          }}>
              ⭐ Popular
            </button>
            {menuCategories.map(cat => <button key={cat.categoryId} onClick={() => setMenuFilter(cat.categoryId)} className="px-5 py-2 rounded-full text-sm font-medium transition-all" style={menuFilter === cat.categoryId ? {
            background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
            color: 'white'
          } : {
            background: 'white',
            color: '#8B6E52',
            border: '1px solid #D4B896'
          }}>
                {cat.icon} {cat.name}
              </button>)}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map(item => <div key={item.itemId} className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1" style={{
            background: 'white'
          }}>
                <div className="h-44 relative flex items-center justify-center text-6xl" style={{
              background: 'linear-gradient(135deg, #F5E6D3, #E8CBA8)'
            }}>
                  {menuCategories.find(c => c.categoryId === item.categoryId)?.icon || '🍽️'}
                  {item.isPopular && <span className="absolute top-3 left-3 text-xs px-2 py-1 rounded-full font-semibold" style={{
                background: '#C8862A',
                color: 'white'
              }}>Popular</span>}
                  {item.isSpicy && <span className="absolute top-3 right-3 text-xs">🌶️</span>}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-base mb-1" style={{
                color: '#2C1810',
                fontFamily: "'Playfair Display', serif"
              }}>
                    {item.name}
                  </h3>
                  <p className="text-xs mb-3 line-clamp-2" style={{
                color: '#8B6E52'
              }}>{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold" style={{
                  color: '#C8862A'
                }}>ETB {item.price}</span>
                    {item.prepTime && <span className="text-xs" style={{
                  color: '#B0926A'
                }}>⏱ {item.prepTime} min</span>}
                  </div>
                </div>
              </div>)}
          </div>

          <div className="text-center mt-10">
            <button onClick={onLoginClick} className="px-8 py-4 rounded-full font-semibold text-sm tracking-wider transition-all hover:scale-105" style={{
            background: '#2C1810',
            color: '#FFF8F0'
          }}>
              Order Online → Login as Customer
            </button>
          </div>
        </div>
      </section>

      {/* ───── EXPERIENCE ───── */}
      <section className="py-24" style={{
      background: '#2C1810'
    }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{
            color: '#C8862A'
          }}>THE HOLY EXPERIENCE</p>
            <h2 className="text-5xl font-black text-white" style={{
            fontFamily: "'Playfair Display', serif"
          }}>
              More Than a Meal
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[{
            emoji: '🍛',
            title: 'Authentic Recipes',
            desc: 'Time-honored recipes passed through generations of Ethiopian families, prepared with love and the finest local ingredients.'
          }, {
            emoji: '☕',
            title: 'Coffee Ceremony',
            desc: 'Experience the ancient Ethiopian buna ceremony — freshly roasted, ground, and brewed tableside for an unforgettable ritual.'
          }, {
            emoji: '🌿',
            title: 'Natural Ingredients',
            desc: 'We source fresh, natural spices and produce from local Dire Dawa markets every morning to ensure peak freshness.'
          }].map((item, i) => <div key={i} className="text-center p-8 rounded-3xl" style={{
            background: 'rgba(200,134,42,0.1)',
            border: '1px solid rgba(200,134,42,0.2)'
          }}>
                <div className="text-5xl mb-4">{item.emoji}</div>
                <h3 className="text-xl font-bold mb-3 text-white" style={{
              fontFamily: "'Playfair Display', serif"
            }}>{item.title}</h3>
                <p className="leading-relaxed text-sm" style={{
              color: '#B0926A'
            }}>{item.desc}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* ───── TESTIMONIALS ───── */}
      <section className="py-24" style={{
      background: '#FDF6EE'
    }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{
            color: '#C8862A'
          }}>GUEST REVIEWS</p>
            <h2 className="text-5xl font-black" style={{
            fontFamily: "'Playfair Display', serif",
            color: '#2C1810'
          }}>
              What People Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[{
            name: 'Selam M.',
            city: 'Dire Dawa',
            text: 'The Doro Wat here is simply the best I\'ve ever had. The spices, the injera, the whole experience feels like home. Holy is truly special!',
            stars: 5
          }, {
            name: 'Ahmed K.',
            city: 'Harar',
            text: 'I drive 45 minutes just for their Ethiopian coffee ceremony. Nothing else comes close. The atmosphere is warm and the staff are so welcoming.',
            stars: 5
          }, {
            name: 'Liya T.',
            city: 'Addis Ababa',
            text: 'Visited Holy on a business trip and was blown away. The Beyaynetu combo platter was incredible — so many flavors working in perfect harmony.',
            stars: 5
          }].map((review, i) => <div key={i} className="p-6 rounded-2xl shadow-md" style={{
            background: 'white'
          }}>
                <div className="flex text-yellow-500 mb-3">{'★'.repeat(review.stars)}</div>
                <p className="text-sm mb-4 italic leading-relaxed" style={{
              color: '#6B4F3A'
            }}>"{review.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{
                background: 'linear-gradient(135deg, #C8862A, #8B3A0F)'
              }}>
                    {review.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{
                  color: '#2C1810'
                }}>{review.name}</p>
                    <p className="text-xs" style={{
                  color: '#8B6E52'
                }}>{review.city}</p>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* ───── CONTACT ───── */}
      <section id="contact" className="py-24" style={{
      background: '#1A1008'
    }}>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm tracking-[0.3em] mb-3 font-semibold" style={{
            color: '#C8862A'
          }}>FIND US</p>
            <h2 className="text-5xl font-black text-white mb-6" style={{
            fontFamily: "'Playfair Display', serif"
          }}>
              Visit Us in<br /><span style={{
              color: '#C8862A'
            }}>Dire Dawa</span>
            </h2>
            <div className="space-y-4">
              {[{
              icon: <MapPin size={18} />,
              label: 'Address',
              value: 'Kezira Area, Dire Dawa, Ethiopia'
            }, {
              icon: <Phone size={18} />,
              label: 'Phone',
              value: '+251 25 111 2345'
            }, {
              icon: <Clock size={18} />,
              label: 'Hours',
              value: 'Mon–Sun: 6:30 AM – 10:30 PM'
            }, {
              icon: <Star size={18} />,
              label: 'Rating',
              value: '4.9/5 – Highly Recommended'
            }].map((item, i) => <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{
              background: 'rgba(200,134,42,0.08)',
              border: '1px solid rgba(200,134,42,0.15)'
            }}>
                  <div style={{
                color: '#C8862A'
              }}>{item.icon}</div>
                  <div>
                    <p className="text-xs" style={{
                  color: '#8B6E52'
                }}>{item.label}</p>
                    <p className="text-sm text-white font-medium">{item.value}</p>
                  </div>
                </div>)}
            </div>
          </div>

          <div className="p-8 rounded-3xl" style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(200,134,42,0.2)'
        }}>
            <h3 className="text-2xl font-bold text-white mb-6" style={{
            fontFamily: "'Playfair Display', serif"
          }}>
              Book a Table
            </h3>
            <div className="space-y-4">
              {[{
              placeholder: 'Your Full Name',
              type: 'text'
            }, {
              placeholder: 'Phone Number',
              type: 'tel'
            }, {
              placeholder: 'Date & Time',
              type: 'datetime-local'
            }, {
              placeholder: 'Number of Guests',
              type: 'number'
            }].map((field, i) => <input key={i} type={field.type} placeholder={field.placeholder} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(200,134,42,0.25)',
              color: 'white'
            }} />)}
              <button className="w-full py-4 rounded-xl font-semibold tracking-wider transition-all hover:scale-105" style={{
              background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
              color: 'white'
            }} onClick={() => alert('Reservation request submitted! We will call you to confirm.')}>
                Request Reservation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer style={{
      background: '#0D0804'
    }} className="py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{
            background: 'linear-gradient(135deg, #C8862A, #8B3A0F)'
          }}>✦</div>
            <span className="text-white font-bold tracking-widest" style={{
            fontFamily: "'Playfair Display', serif"
          }}>HOLY RESTAURANT</span>
          </div>
          <div className="flex gap-2">
            <div className="w-6 h-2 rounded" style={{
            background: '#078930'
          }} />
            <div className="w-6 h-2 rounded" style={{
            background: '#FCDD09'
          }} />
            <div className="w-6 h-2 rounded" style={{
            background: '#DA121A'
          }} />
          </div>
          <p className="text-xs" style={{
          color: '#5A3E2B'
        }}>© 2025 Holy Restaurant, Dire Dawa, Ethiopia. All rights reserved.</p>
        </div>
      </footer>
    </div>;
};
export default LandingPage;