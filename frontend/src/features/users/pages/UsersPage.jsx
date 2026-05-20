import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUsers, useCreateUser, useDeleteUser, useChangeUserRole } from '../hooks/useUsers.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import Badge from '../../../shared/components/ui/Badge.jsx';
import Modal from '../../../shared/components/ui/Modal.jsx';
import Spinner from '../../../shared/components/ui/Spinner.jsx';
import { ROLE_COLORS } from '../../../shared/components/Sidebar/sidebarConfig.jsx';

const ROLES = ['admin', 'cashier', 'waiter', 'chef', 'customer'];
const EMPTY_FORM = { name: '', email: '', password: '', phone: '', role: 'waiter' };

export default function UsersPage() {
  const { hasPermission } = usePermission();
  const { data: users = [], isLoading } = useUsers();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();
  const changeRole = useChangeUserRole();

  const canManage = hasPermission(PERMISSIONS.USERS_MANAGE);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    createUser.mutate(form, {
      onSuccess: () => { setShowCreate(false); setForm(EMPTY_FORM); toast.success('User created'); },
      onError: () => toast.error('Failed to create user'),
    });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Users</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>{users.length} staff members</p>
        </div>
        {canManage && (
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
            <Plus size={16} /> Add User
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'white', border: '1px solid #E8D5C0', maxWidth: '28rem' }}>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email..." className="bg-transparent text-sm outline-none flex-1" style={{ color: '#2C1810' }} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(user => {
            const roleColor = ROLE_COLORS[user.role] || '#C8862A';
            return (
              <div key={user.userId} className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${roleColor}, ${roleColor}88)` }}>
                    {user.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{ color: '#2C1810' }}>{user.name}</p>
                    <p className="text-xs truncate" style={{ color: '#8B6E52' }}>{user.email}</p>
                    <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 capitalize font-medium"
                      style={{ background: `${roleColor}20`, color: roleColor }}>{user.role}</span>
                  </div>
                </div>
                {canManage && (
                  <div className="flex gap-2">
                    <select value={user.role} onChange={e => changeRole.mutate({ id: user.userId, role: e.target.value }, { onSuccess: () => toast.success('Role updated') })}
                      className="flex-1 px-3 py-2 rounded-xl text-xs outline-none capitalize"
                      style={{ border: '1px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
                      {ROLES.filter(r => r !== 'admin').map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    <button onClick={() => { if (confirm('Delete this user?')) deleteUser.mutate(user.userId, { onSuccess: () => toast.success('Deleted') }); }}
                      className="p-2 rounded-xl hover:bg-red-50" style={{ color: '#DC2626' }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Add New User" size="md"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setShowCreate(false)} className="flex-1 py-3 rounded-xl text-sm" style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
            <button onClick={handleCreate} disabled={createUser.isPending} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>
              {createUser.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        }>
        <div className="space-y-4">
          {[
            { k: 'name',     l: 'Full Name',    t: 'text'     },
            { k: 'email',    l: 'Email',         t: 'email'    },
            { k: 'password', l: 'Password',      t: 'password' },
            { k: 'phone',    l: 'Phone',          t: 'tel'      },
          ].map(f => (
            <div key={f.k}>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>{f.l}</label>
              <input type={f.t} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Role</label>
            <select value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none capitalize"
              style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
              {ROLES.filter(r => r !== 'admin').map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
