import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import AdminDashboard from './dashboard/AdminDashboard';
import MenuSection from './sections/MenuSection';
import OrdersSection from './sections/OrdersSection';
import TablesSection from './sections/TablesSection';
import ReservationsSection from './sections/ReservationsSection';
import InventorySection from './sections/InventorySection';
import PaymentsSection from './sections/PaymentsSection';
import ReportsSection from './sections/ReportsSection';
import UsersSection from './sections/UsersSection';
import { useApp } from '../context/AppContext';
const SettingsSection = () => {
  const {
    currentUser
  } = useApp();
  return <div className="p-6">
      <h2 className="text-2xl font-black mb-6" style={{
      color: '#2C1810',
      fontFamily: "'Playfair Display', serif"
    }}>Settings</h2>
      <div className="max-w-xl space-y-4">
        {[{
        label: 'Restaurant Name',
        value: 'Holy Restaurant'
      }, {
        label: 'Location',
        value: 'Kezira Area, Dire Dawa, Ethiopia'
      }, {
        label: 'Phone',
        value: '+251 25 111 2345'
      }, {
        label: 'Currency',
        value: 'ETB (Ethiopian Birr)'
      }, {
        label: 'Opening Hours',
        value: '6:30 AM – 10:30 PM'
      }].map(s => <div key={s.label} className="rounded-xl p-4" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{
          color: '#8B6E52'
        }}>{s.label}</label>
            <input defaultValue={s.value} className="w-full text-sm outline-none" style={{
          color: '#2C1810',
          background: 'transparent'
        }} />
          </div>)}
        <button className="px-6 py-3 rounded-xl text-sm font-semibold" style={{
        background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
        color: 'white'
      }}>
          Save Settings
        </button>
      </div>
    </div>;
};
const CustomerDashboard = ({
  onNavigate
}) => {
  const {
    menuItems,
    orders,
    currentUser
  } = useApp();
  const popularItems = menuItems.filter(i => i.isPopular).slice(0, 6);
  const myOrders = orders.filter(o => o.customerName === currentUser?.name);
  return <div className="p-6 space-y-6">
      <div className="rounded-2xl p-6" style={{
      background: 'linear-gradient(135deg, #1A1008, #2C1810)',
      border: '1px solid rgba(200,134,42,0.2)'
    }}>
        <h2 className="text-2xl font-bold text-white mb-1" style={{
        fontFamily: "'Playfair Display', serif"
      }}>
          Welcome to Holy Restaurant! 🍛
        </h2>
        <p style={{
        color: '#8B6E52'
      }}>Explore our menu, make reservations, or check your orders</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{
        label: 'Browse Menu',
        icon: '🍽️',
        section: 'menu',
        color: '#C8862A',
        bg: '#FEF9EE'
      }, {
        label: 'Reservations',
        icon: '📅',
        section: 'reservations',
        color: '#0369A1',
        bg: '#EFF6FF'
      }, {
        label: 'My Orders',
        icon: '📋',
        section: 'orders',
        color: '#059669',
        bg: '#ECFDF5'
      }].map((item, i) => <button key={i} onClick={() => onNavigate(item.section)} className="p-5 rounded-2xl text-center transition-all hover:scale-105 shadow-sm" style={{
        background: item.bg
      }}>
            <div className="text-4xl mb-2">{item.icon}</div>
            <div className="font-semibold text-sm" style={{
          color: item.color
        }}>{item.label}</div>
          </button>)}
      </div>
      <h3 className="font-bold text-lg" style={{
      color: '#2C1810',
      fontFamily: "'Playfair Display', serif"
    }}>⭐ Today's Highlights</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {popularItems.map(item => <div key={item.itemId} className="rounded-2xl overflow-hidden shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <div className="h-32 flex items-center justify-center text-5xl" style={{
          background: 'linear-gradient(135deg, #F5E6D3, #E8CBA8)'
        }}>
              🍛
            </div>
            <div className="p-4">
              <h4 className="font-bold text-sm" style={{
            color: '#2C1810',
            fontFamily: "'Playfair Display', serif"
          }}>{item.name}</h4>
              <p className="text-xs mb-2 line-clamp-1" style={{
            color: '#8B6E52'
          }}>{item.description}</p>
              <div className="flex justify-between items-center">
                <span className="font-bold" style={{
              color: '#C8862A'
            }}>ETB {item.price}</span>
                {item.isSpicy && <span className="text-xs">🌶️ Spicy</span>}
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
const Dashboard = () => {
  const {
    currentUser,
    sidebarOpen
  } = useApp();
  const [activeSection, setActiveSection] = useState('dashboard');
  if (!currentUser) return null;
  const renderSection = () => {
    if (activeSection === 'dashboard') {
      if (currentUser.role === 'customer') return <CustomerDashboard onNavigate={setActiveSection} />;
      return <AdminDashboard />;
    }
    switch (activeSection) {
      case 'menu':
        return <MenuSection />;
      case 'orders':
        return <OrdersSection />;
      case 'tables':
        return <TablesSection />;
      case 'reservations':
        return <ReservationsSection />;
      case 'inventory':
        return <InventorySection />;
      case 'payments':
        return <PaymentsSection />;
      case 'reports':
        return <ReportsSection />;
      case 'users':
        return <UsersSection />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <AdminDashboard />;
    }
  };
  return <div className="flex h-screen overflow-hidden" style={{
    background: '#FAF0E6',
    fontFamily: "'Inter', sans-serif"
  }}>
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
        <Topbar activeSection={activeSection} />
        <main className="flex-1 overflow-y-auto">
          {renderSection()}
        </main>
      </div>
    </div>;
};
export default Dashboard;