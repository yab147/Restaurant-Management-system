import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';

const roleColors: Record<UserRole, { bg: string; color: string }> = {
  admin: { bg: '#F5F3FF', color: '#7C3AED' },
  manager: { bg: '#EFF6FF', color: '#0369A1' },
  waiter: { bg: '#ECFDF5', color: '#059669' },
  chef: { bg: '#FFFBEB', color: '#D97706' },
  cashier: { bg: '#FEF2F2', color: '#DC2626' },
  customer: { bg: '#FEF9EE', color: '#C8862A' },
};

const roleEmojis: Record<UserRole, string> = {
  admin: '👑', manager: '📊', waiter: '🍽️', chef: '👨‍🍳', cashier: '💰', customer: '🧑‍🤝‍🧑',
};

const UsersSection: React.FC = () => {
  const { allUsers, setAllUsers } = useApp();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'waiter' as UserRole });

  const filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.includes(search.toLowerCase())
  );

  const handleSave = () => {
    if (!form.name || !form.email) return;
    if (editUser) {
      setAllUsers(prev => prev.map(u => u.userId === editUser.userId ? { ...u, ...form } : u));
    } else {
      const newUser: User = { userId: Date.now(), ...form };
      setAllUsers(prev => [...prev, newUser]);
    }
    setShowForm(false);
    setEditUser(null);
    setForm({ name: '', email: '', password: '', phone: '', role: 'waiter' });
  };

  const openEdit = (user: User) => {
    setEditUser(user);
    setForm({ name: user.name, email: user.email, password: user.password, phone: user.phone, role: user.role });
    setShowForm(true);
  };

  const deleteUser = (userId: number) => {
    if (confirm('Delete this user?')) setAllUsers(prev => prev.filter(u => u.userId !== userId));
  };

  const roleCounts = (Object.keys(roleColors) as UserRole[]).map(role => ({
    role, count: allUsers.filter(u => u.role === role).length
  }));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>User Management</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>{allUsers.length} registered users</p>
        </div>
        <button onClick={() => { setEditUser(null); setForm({ name: '', email: '', password: '', phone: '', role: 'waiter' }); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
          <Plus size={16} /> Add User
        </button>
      </div>

      {/* Role summary */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {roleCounts.map(({ role, count }) => {
          const cfg = roleColors[role];
          return (
            <div key={role} className="rounded-2xl p-4 text-center" style={{ background: cfg.bg }}>
              <div className="text-2xl mb-1">{roleEmojis[role]}</div>
              <div className="text-2xl font-black" style={{ color: cfg.color, fontFamily: "'Playfair Display', serif" }}>{count}</div>
              <div className="text-xs font-medium capitalize" style={{ color: cfg.color }}>{role}</div>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'white', border: '1px solid #E8D5C0' }}>
        <Search size={15} style={{ color: '#8B6E52' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..."
          className="bg-transparent text-sm outline-none flex-1" style={{ color: '#2C1810' }} />
      </div>

      {/* User grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(user => {
          const cfg = roleColors[user.role];
          return (
            <div key={user.userId} className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow"
                    style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}88)` }}>
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold" style={{ color: '#2C1810' }}>{user.name}</p>
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize"
                      style={cfg}>{roleEmojis[user.role]} {user.role}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-1 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: '#B0926A' }}>✉</span>
                  <span style={{ color: '#6B4F3A' }}>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: '#B0926A' }}>📞</span>
                  <span style={{ color: '#6B4F3A' }}>{user.phone}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(user)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1"
                  style={{ background: '#EFF6FF', color: '#0369A1' }}>
                  <Edit2 size={13} /> Edit
                </button>
                <button onClick={() => deleteUser(user.userId)}
                  className="flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1"
                  style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  <Trash2 size={13} /> Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: 'white' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
                {editUser ? 'Edit User' : 'Add User'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ color: '#8B6E52' }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', type: 'text' },
                { label: 'Email', key: 'email', type: 'email' },
                { label: 'Password', key: 'password', type: 'password' },
                { label: 'Phone', key: 'phone', type: 'tel' },
              ].map(f => (
                <div key={f.key}>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>{f.label}</label>
                  <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
                </div>
              ))}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Role</label>
                <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value as UserRole }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
                  {(Object.keys(roleColors) as UserRole[]).map(role => (
                    <option key={role} value={role}>{roleEmojis[role]} {role}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm" style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
                {editUser ? 'Update' : 'Add'} User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersSection;
