import React, { useState, useMemo } from 'react';
import { Plus, Search, AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInventory, useCreateIngredient, useUpdateIngredient, useDeleteIngredient, useRestockIngredient } from '../hooks/useInventory.js';
import { useInventoryStore } from '../store/useInventoryStore.js';
import { usePermission }     from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS }       from '../../../permissions/matrix.js';
import Spinner               from '../../../shared/components/ui/Spinner.jsx';
import Modal                 from '../../../shared/components/ui/Modal.jsx';

const EMPTY_FORM = { name: '', unit: '', quantity: 0, reorderLevel: 0, costPerUnit: 0 };

export default function InventoryPage() {
  const { hasPermission } = usePermission();
  const { filters, setFilters, editingItem, setEditingItem, restockItem, setRestockItem } = useInventoryStore();

  const { data: ingredients = [], isLoading } = useInventory();
  const createIngredient = useCreateIngredient();
  const updateIngredient = useUpdateIngredient();
  const deleteIngredient = useDeleteIngredient();
  const restockIngredient = useRestockIngredient();

  const canEdit    = hasPermission(PERMISSIONS.INVENTORY_EDIT);
  const canRestock = hasPermission(PERMISSIONS.INVENTORY_RESTOCK);
  const canDelete  = hasPermission(PERMISSIONS.INVENTORY_DELETE);

  const [form, setForm]         = useState(EMPTY_FORM);
  const [restockAmt, setRestockAmt] = useState(0);

  const filtered = useMemo(() => {
    let list = ingredients;
    if (filters.search) list = list.filter(i => i.name?.toLowerCase().includes(filters.search.toLowerCase()));
    if (filters.lowStock) list = list.filter(i => i.quantity <= i.reorderLevel);
    return list;
  }, [ingredients, filters]);

  const lowStockCount = ingredients.filter(i => i.quantity <= i.reorderLevel).length;

  const handleSave = () => {
    const payload = { ...form, quantity: Number(form.quantity), reorderLevel: Number(form.reorderLevel), costPerUnit: Number(form.costPerUnit) };
    if (editingItem?.ingredientId) {
      updateIngredient.mutate({ id: editingItem.ingredientId, ...payload }, {
        onSuccess: () => { setEditingItem(null); toast.success('Ingredient updated'); },
        onError: () => toast.error('Update failed'),
      });
    } else {
      createIngredient.mutate(payload, {
        onSuccess: () => { setEditingItem(null); toast.success('Ingredient added'); },
        onError: () => toast.error('Create failed'),
      });
    }
  };

  const handleRestock = () => {
    restockIngredient.mutate({ id: restockItem.ingredientId, amount: Number(restockAmt) }, {
      onSuccess: () => { setRestockItem(null); setRestockAmt(0); toast.success('Restocked successfully'); },
      onError: () => toast.error('Restock failed'),
    });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Inventory</h2>
          {lowStockCount > 0 && (
            <p className="text-sm flex items-center gap-1" style={{ color: '#DC2626' }}>
              <AlertTriangle size={14} /> {lowStockCount} items low on stock
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilters({ lowStock: !filters.lowStock })}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={filters.lowStock ? { background: '#DC2626', color: 'white' } : { background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
            <AlertTriangle size={14} className="inline mr-1" />Low Stock
          </button>
          {canEdit && (
            <button onClick={() => { setForm(EMPTY_FORM); setEditingItem({}); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
              <Plus size={16} /> Add Ingredient
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: 'white', border: '1px solid #E8D5C0', maxWidth: '28rem' }}>
        <Search size={15} style={{ color: '#8B6E52' }} />
        <input value={filters.search || ''} onChange={e => setFilters({ search: e.target.value })}
          placeholder="Search ingredients..." className="bg-transparent text-sm outline-none flex-1" style={{ color: '#2C1810' }} />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#F0E8DE' }}>
          <table className="w-full">
            <thead style={{ background: '#F8F0E8' }}>
              <tr>
                {['Ingredient', 'Unit', 'In Stock', 'Reorder Level', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B4F3A' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-12 text-sm" style={{ color: '#8B6E52' }}>No ingredients found.</td></tr>
              ) : filtered.map(ing => {
                const isLow = ing.quantity <= ing.reorderLevel;
                return (
                  <tr key={ing.ingredientId} className="border-t hover:bg-amber-50/30 transition-colors" style={{ borderColor: '#F0E8DE' }}>
                    <td className="px-4 py-3 font-semibold text-sm" style={{ color: '#2C1810' }}>{ing.name}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#8B6E52' }}>{ing.unit}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: isLow ? '#DC2626' : '#059669' }}>{ing.quantity}</td>
                    <td className="px-4 py-3 text-sm" style={{ color: '#8B6E52' }}>{ing.reorderLevel}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{ background: isLow ? '#FEF2F2' : '#ECFDF5', color: isLow ? '#DC2626' : '#059669' }}>
                        {isLow ? 'Low Stock' : 'Normal'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {canRestock && (
                          <button onClick={() => { setRestockItem(ing); setRestockAmt(0); }}
                            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
                            style={{ background: '#059669', color: 'white' }}>Restock</button>
                        )}
                        {canEdit && (
                          <button onClick={() => { setForm({ name: ing.name, unit: ing.unit, quantity: ing.quantity, reorderLevel: ing.reorderLevel, costPerUnit: ing.costPerUnit || 0 }); setEditingItem(ing); }}
                            className="p-1.5 rounded-lg hover:bg-amber-50" style={{ color: '#0369A1' }}><Edit2 size={14} /></button>
                        )}
                        {canDelete && (
                          <button onClick={() => { if(confirm('Delete this ingredient?')) deleteIngredient.mutate(ing.ingredientId, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') }); }}
                            className="p-1.5 rounded-lg hover:bg-red-50" style={{ color: '#DC2626' }}><Trash2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={!!editingItem} onClose={() => setEditingItem(null)} title={editingItem?.ingredientId ? 'Edit Ingredient' : 'Add Ingredient'} size="sm"
        footer={<div className="flex gap-3">
          <button onClick={() => setEditingItem(null)} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>Save</button>
        </div>}>
        <div className="space-y-4">
          {[{ key: 'name', label: 'Name' }, { key: 'unit', label: 'Unit (kg, L, pcs)' }, { key: 'quantity', label: 'Current Quantity', type: 'number' }, { key: 'reorderLevel', label: 'Reorder Level', type: 'number' }].map(f => (
            <div key={f.key}>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>{f.label}</label>
              <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
            </div>
          ))}
        </div>
      </Modal>

      <Modal isOpen={!!restockItem} onClose={() => setRestockItem(null)} title={`Restock: ${restockItem?.name}`} size="sm"
        footer={<div className="flex gap-3">
          <button onClick={() => setRestockItem(null)} className="flex-1 py-3 rounded-xl text-sm" style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
          <button onClick={handleRestock} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: '#059669' }}>Restock</button>
        </div>}>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Amount to Add ({restockItem?.unit})</label>
          <input type="number" value={restockAmt} onChange={e => setRestockAmt(e.target.value)} min={1}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
          <p className="text-xs mt-2" style={{ color: '#8B6E52' }}>Current: {restockItem?.quantity} {restockItem?.unit}</p>
        </div>
      </Modal>
    </div>
  );
}
