import React, { useState } from 'react';
import { Plus, AlertTriangle, CheckCircle, Search, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Ingredient } from '../../types';

const InventorySection: React.FC = () => {
  const { ingredients, setIngredients, currentUser } = useApp();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState<Ingredient | null>(null);
  const [form, setForm] = useState({ name: '', quantity: '', unit: 'kg', threshold: '' });

  const canEdit = ['admin', 'manager'].includes(currentUser?.role || '');

  const filtered = ingredients.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
  const lowStock = ingredients.filter(i => i.quantity <= i.threshold);
  const okStock = ingredients.filter(i => i.quantity > i.threshold);

  const handleSave = () => {
    if (!form.name || !form.quantity || !form.threshold) return;
    if (editItem) {
      setIngredients(prev => prev.map(i => i.ingredientId === editItem.ingredientId ? {
        ...i, name: form.name, quantity: Number(form.quantity), unit: form.unit, threshold: Number(form.threshold)
      } : i));
    } else {
      const newIng: Ingredient = {
        ingredientId: Date.now(), name: form.name, quantity: Number(form.quantity), unit: form.unit, threshold: Number(form.threshold)
      };
      setIngredients(prev => [...prev, newIng]);
    }
    setShowAdd(false);
    setEditItem(null);
    setForm({ name: '', quantity: '', unit: 'kg', threshold: '' });
  };

  const openEdit = (ing: Ingredient) => {
    setEditItem(ing);
    setForm({ name: ing.name, quantity: ing.quantity.toString(), unit: ing.unit, threshold: ing.threshold.toString() });
    setShowAdd(true);
  };

  const updateQty = (id: number, delta: number) => {
    setIngredients(prev => prev.map(i => i.ingredientId === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i));
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Inventory</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>{lowStock.length} items need restocking</p>
        </div>
        {canEdit && (
          <button onClick={() => { setEditItem(null); setForm({ name: '', quantity: '', unit: 'kg', threshold: '' }); setShowAdd(true); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
            <Plus size={16} /> Add Ingredient
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl p-4 text-center" style={{ background: '#F5E6D3' }}>
          <div className="text-3xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>{ingredients.length}</div>
          <div className="text-xs font-medium" style={{ color: '#8B6E52' }}>Total Ingredients</div>
        </div>
        <div className="rounded-2xl p-4 text-center" style={{ background: '#FEF2F2' }}>
          <div className="text-3xl font-black" style={{ color: '#DC2626', fontFamily: "'Playfair Display', serif" }}>{lowStock.length}</div>
          <div className="text-xs font-medium text-red-500">Low / Out of Stock</div>
        </div>
        <div className="rounded-2xl p-4 text-center" style={{ background: '#ECFDF5' }}>
          <div className="text-3xl font-black" style={{ color: '#059669', fontFamily: "'Playfair Display', serif" }}>{okStock.length}</div>
          <div className="text-xs font-medium text-green-600">Well Stocked</div>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="rounded-2xl p-4" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-red-500" />
            <span className="font-bold text-sm text-red-700">⚠️ Low Stock Alert — {lowStock.length} items need restocking</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {lowStock.map(ing => (
              <span key={ing.ingredientId} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: '#FEE2E2', color: '#DC2626' }}>
                {ing.name}: {ing.quantity} {ing.unit} (min: {ing.threshold})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'white', border: '1px solid #E8D5C0' }}>
        <Search size={15} style={{ color: '#8B6E52' }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ingredients..."
          className="bg-transparent text-sm outline-none flex-1" style={{ color: '#2C1810' }} />
      </div>

      {/* Ingredient Table */}
      <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#F5E6D3' }}>
              {['Ingredient', 'Stock', 'Unit', 'Min. Threshold', 'Status', canEdit ? 'Actions' : ''].filter(Boolean).map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#6B4F3A' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(ing => {
              const isLow = ing.quantity <= ing.threshold;
              const pct = Math.min((ing.quantity / (ing.threshold * 2)) * 100, 100);
              return (
                <tr key={ing.ingredientId} className="border-t transition-colors hover:bg-amber-50/30" style={{ borderColor: '#F0E8DE' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {isLow
                        ? <AlertTriangle size={14} className="text-red-500" />
                        : <CheckCircle size={14} className="text-green-500" />}
                      <span className="font-medium" style={{ color: '#2C1810' }}>{ing.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${isLow ? 'text-red-600' : 'text-green-700'}`}>{ing.quantity}</span>
                      <div className="w-20 h-1.5 rounded-full" style={{ background: '#F0E8DE' }}>
                        <div className="h-1.5 rounded-full transition-all" style={{ background: isLow ? '#DC2626' : '#059669', width: `${pct}%` }} />
                      </div>
                      {canEdit && (
                        <div className="flex items-center gap-1">
                          <button onClick={() => updateQty(ing.ingredientId, -1)} className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                            style={{ background: '#FEE2E2', color: '#DC2626' }}>−</button>
                          <button onClick={() => updateQty(ing.ingredientId, 1)} className="w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center"
                            style={{ background: '#ECFDF5', color: '#059669' }}>+</button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#8B6E52' }}>{ing.unit}</td>
                  <td className="px-4 py-3" style={{ color: '#8B6E52' }}>{ing.threshold} {ing.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${isLow ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                      {isLow ? '⚠ Low Stock' : '✓ OK'}
                    </span>
                  </td>
                  {canEdit && (
                    <td className="px-4 py-3">
                      <button onClick={() => openEdit(ing)} className="text-xs px-3 py-1 rounded-lg font-medium"
                        style={{ background: '#F0E8DE', color: '#8B3A0F' }}>Edit</button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{ background: 'white' }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
                {editItem ? 'Edit Ingredient' : 'Add Ingredient'}
              </h3>
              <button onClick={() => setShowAdd(false)} style={{ color: '#8B6E52' }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Quantity</label>
                  <input type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Unit</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
                    {['kg', 'g', 'L', 'ml', 'pcs', 'bags', 'bottles'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Minimum Threshold</label>
                <input type="number" value={form.threshold} onChange={e => setForm(f => ({ ...f, threshold: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl text-sm" style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
                {editItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventorySection;
