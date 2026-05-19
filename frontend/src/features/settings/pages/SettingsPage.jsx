import React from 'react';
import { Link } from 'react-router-dom';
import { Settings as SettingsIcon, Shield, Bell } from 'lucide-react';
import { useAuth } from '../../../providers/AuthProvider.jsx';
import { ROUTES } from '../../../constants/routes.js';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black flex items-center gap-2" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
          <SettingsIcon size={28} style={{ color: '#C8862A' }} />
          Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: '#8B6E52' }}>Workspace preferences and information</p>
      </div>

      <div className="rounded-2xl p-6 space-y-4" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
        <h2 className="font-bold text-sm uppercase tracking-wide" style={{ color: '#6B4F3A' }}>Signed in as</h2>
        <p className="text-lg font-semibold" style={{ color: '#2C1810' }}>{user?.name}</p>
        <p className="text-sm capitalize" style={{ color: '#8B6E52' }}>{user?.role} · {user?.email}</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
          <Shield className="mb-3" size={22} style={{ color: '#0369A1' }} />
          <h3 className="font-bold mb-1" style={{ color: '#2C1810' }}>Access</h3>
          <p className="text-xs" style={{ color: '#8B6E52' }}>Your role controls which modules appear in the sidebar. Contact an administrator to change permissions.</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
          <Bell className="mb-3" size={22} style={{ color: '#D97706' }} />
          <h3 className="font-bold mb-1" style={{ color: '#2C1810' }}>Notifications</h3>
          <p className="text-xs" style={{ color: '#8B6E52' }}>Alerts in the top bar are scoped to your role and refresh automatically.</p>
        </div>
      </div>

      <p className="text-xs text-center" style={{ color: '#8B6E52' }}>
        <Link to={ROUTES.DASHBOARD} className="font-semibold underline" style={{ color: '#C8862A' }}>← Back to dashboard</Link>
      </p>
    </div>
  );
}
