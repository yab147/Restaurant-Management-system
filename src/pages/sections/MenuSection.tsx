import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Star } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { menuCategories } from '../../data/mockData';
import { MenuItem } from '../../types';

const MenuSection: React.FC = () => {
  const { menuItems, setMenuItems, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: 1, prepTime: '', isSpicy: false });

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const filtered = menuItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === 'all' || item.categoryId === categoryFilter;
    return matchSearch && matchCat;
  });

  const handleToggle = (itemId: number) => {
    setMenuItems(prev => prev.map(i => i.itemId === itemId ? { ...i, availability: !i.availability } : i));
  };

  const handleDelete = (itemId: number) => {
    if (confirm('Delete this menu item?')) {
      setMenuItems(prev => prev.filter(i => i.itemId !== itemId));
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditItem(item);
    setForm({ name: item.name, description: item.description, price: item.price.toString(), categoryId: item.categoryId, prepTime: item.prepTime?.toString() || '', isSpicy: item.isSpicy || false });
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.name || !form.price) return;
    if (editItem) {
      setMenuItems(prev => prev.map(i => i.itemId === editItem.itemId ? {
        ...i, name: form.name, description: form.description, price: Number(form.price),
        categoryId: form.categoryId, prepTime: Number(form.prepTime), isSpicy: form.isSpicy
      } : i));
    } else {
      const newItem: MenuItem = {
        itemId: Date.now(), categoryId: form.categoryId, name: form.name, description: form.description,
        price: Number(form.price), availability: true, prepTime: Number(form.prepTime), isSpicy: form.isSpicy
      };
      setMenuItems(prev => [...prev, newItem]);
    }
    setShowForm(false);
    setEditItem(null);
    setForm({ name: '', description: '', price: '', categoryId: 1, prepTime: '', isSpicy: false });
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Menu Management</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>{menuItems.length} items across {menuCategories.length} categories</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setShowForm(true); setForm({ name: '', description: '', price: '', categoryId: 1, prepTime: '', isSpicy: false }); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
            <Plus size={16} /> Add Item
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1" style={{ background: 'white', border: '1px solid #E8D5C0' }}>
          <Search size={15} style={{ color: '#8B6E52' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search menu items..."
            className="bg-transparent text-sm outline-none flex-1" style={{ color: '#2C1810' }} />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCategoryFilter('all')}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={categoryFilter === 'all' ? { background: '#C8862A', color: 'white' } : { background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
            All
          </button>
          {menuCategories.map(cat => (
            <button key={cat.categoryId} onClick={() => setCategoryFilter(cat.categoryId)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={categoryFilter === cat.categoryId ? { background: '#C8862A', color: 'white' } : { background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(item => {
          const cat = menuCategories.find(c => c.categoryId === item.categoryId);
          return (
            <div key={item.itemId} className={`rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-md ${!item.availability ? 'opacity-60' : ''}`}
              style={{ background: 'white', border: '1px solid #F0E8DE' }}>
              <div className="h-36 flex items-center justify-center text-5xl relative"
                style={{ background: 'linear-gradient(135deg, #F5E6D3, #E8CBA8)' }}>
                {cat?.icon || '🍽️'}
                {item.isPopular && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: '#C8862A', color: 'white' }}>
                    <Star size={10} /> Popular
                  </span>
                )}
                {item.isSpicy && (
                  <span className="absolute top-2 right-2 text-sm">🌶️</span>
                )}
                {!item.availability && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="text-white text-xs font-bold px-3 py-1 rounded-full bg-black/60">Unavailable</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm mb-1" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>{item.name}</h3>
                <p className="text-xs mb-3 line-clamp-2" style={{ color: '#8B6E52' }}>{item.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold" style={{ color: '#C8862A' }}>ETB {item.price}</span>
                  {item.prepTime && <span className="text-xs" style={{ color: '#B0926A' }}>⏱ {item.prepTime}m</span>}
                </div>
                {canEdit && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleToggle(item.itemId)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all`}
                      style={item.availability
                        ? { background: '#ECFDF5', color: '#059669' }
                        : { background: '#FEE2E2', color: '#DC2626' }}>
                      {item.availability ? '✓ Available' : '✗ Unavailable'}
                    </button>
                    <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg transition-all hover:bg-blue-50"
                      style={{ color: '#0369A1' }}><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(item.itemId)} className="p-1.5 rounded-lg transition-all hover:bg-red-50"
                      style={{ color: '#DC2626' }}><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{ background: 'white' }}>
            <h3 className="text-xl font-bold mb-5" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
              {editItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Price (ETB)</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Prep Time (min)</label>
                  <input type="number" value={form.prepTime} onChange={e => setForm(f => ({ ...f, prepTime: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Category</label>
                <select value={form.categoryId} onChange={e => setForm(f => ({ ...f, categoryId: Number(e.target.value) }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
                  {menuCategories.map(cat => (
                    <option key={cat.categoryId} value={cat.categoryId}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.isSpicy} onChange={e => setForm(f => ({ ...f, isSpicy: e.target.checked }))} className="rounded" />
                <span className="text-sm" style={{ color: '#6B4F3A' }}>🌶️ Spicy dish</span>
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm font-medium"
                style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-sm font-semibold"
                style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
                {editItem ? 'Update' : 'Add'} Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuSection;
