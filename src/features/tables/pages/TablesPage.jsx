import React, { useMemo } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTables, useUpdateTableStatus, useCreateTable, useDeleteTable } from '../hooks/useTables.js';
import { useTableStore } from '../store/useTableStore.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS }   from '../../../permissions/matrix.js';
import Badge             from '../../../shared/components/ui/Badge.jsx';
import Spinner           from '../../../shared/components/ui/Spinner.jsx';
import Modal             from '../../../shared/components/ui/Modal.jsx';

const TABLE_STATUSES = ['all', 'available', 'occupied', 'reserved', 'cleaning'];
const EMPTY_FORM = { number: '', capacity: 4, location: '' };

export default function TablesPage() {
  const { hasPermission } = usePermission();
  const { filters, setFilters, editingTable, setEditingTable } = useTableStore();

  const { data: tables = [], isLoading } = useTables();
  const updateStatus = useUpdateTableStatus();
  const createTable  = useCreateTable();
  const deleteTable  = useDeleteTable();

  const canManage = hasPermission(PERMISSIONS.TABLES_MANAGE);

  const [form, setForm] = React.useState(EMPTY_FORM);

  const filtered = useMemo(() => {
    let list = tables;
    if (filters.status && filters.status !== 'all') list = list.filter(t => t.status === filters.status);
    if (filters.search) list = list.filter(t => String(t.number).includes(filters.search));
    return list;
  }, [tables, filters]);

  const handleStatusChange = (tableId, status) => {
    updateStatus.mutate({ id: tableId, status }, {
      onSuccess: () => toast.success(`Table marked as ${status}`),
      onError: () => toast.error('Failed to update table status'),
    });
  };

  const handleSave = () => {
    createTable.mutate({ ...form, capacity: Number(form.capacity) }, {
      onSuccess: () => { setEditingTable(null); toast.success('Table created'); },
      onError: () => toast.error('Failed to create table'),
    });
  };

  const STATUS_CYCLE = { available: 'occupied', occupied: 'cleaning', cleaning: 'available', reserved: 'available' };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Tables</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>
            {tables.filter(t => t.status === 'available').length} available · {tables.filter(t => t.status === 'occupied').length} occupied
          </p>
        </div>
        {canManage && (
          <button onClick={() => { setForm(EMPTY_FORM); setEditingTable({}); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
            <Plus size={16} /> Add Table
          </button>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABLE_STATUSES.map(s => (
          <button key={s} onClick={() => setFilters({ status: s })} className="px-3 py-2 rounded-xl text-xs font-medium capitalize"
            style={filters.status === s ? { background: '#C8862A', color: 'white' } : { background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(table => (
            <div key={table.tableId} className="rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
              style={{ background: 'white', border: '1px solid #F0E8DE' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>
                    Table {table.number}
                  </h3>
                  <p className="text-xs" style={{ color: '#8B6E52' }}>{table.capacity} seats · {table.location || 'Main Hall'}</p>
                </div>
                <Badge status={table.status} />
              </div>
              {canManage && STATUS_CYCLE[table.status] && (
                <button onClick={() => handleStatusChange(table.tableId, STATUS_CYCLE[table.status])}
                  className="w-full mt-3 py-2 rounded-xl text-xs font-medium transition-all hover:opacity-90 capitalize"
                  style={{ background: '#F0E8DE', color: '#8B3A0F' }}>
                  → Mark as {STATUS_CYCLE[table.status]}
                </button>
              )}
              {canManage && (
                <button onClick={() => { if (confirm('Delete this table?')) deleteTable.mutate(table.tableId, { onSuccess: () => toast.success('Deleted'), onError: () => toast.error('Failed') }); }}
                  className="mt-2 w-full py-1.5 rounded-xl text-xs text-red-400 hover:bg-red-50 transition-colors">
                  <Trash2 size={12} className="inline mr-1" /> Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!editingTable} onClose={() => setEditingTable(null)} title="Add Table" size="sm"
        footer={<div className="flex gap-3">
          <button onClick={() => setEditingTable(null)} className="flex-1 py-3 rounded-xl text-sm" style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>Create Table</button>
        </div>}>
        <div className="space-y-4">
          <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Table Number</label>
            <input type="number" value={form.number} onChange={e => setForm(p => ({ ...p, number: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} /></div>
          <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Capacity</label>
            <input type="number" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} min={1}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} /></div>
          <div><label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Location</label>
            <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="e.g. Main Hall, Patio"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} /></div>
        </div>
      </Modal>
    </div>
  );
}
