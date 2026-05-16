import React, { useState, useMemo } from 'react';
import { Plus, Search, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useReservations, useCreateReservation, useCancelReservation, useConfirmReservation } from '../hooks/useReservations.js';
import { useReservationStore } from '../store/useReservationStore.js';
import { useTables } from '../../tables/hooks/useTables.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import Badge from '../../../shared/components/ui/Badge.jsx';
import Modal from '../../../shared/components/ui/Modal.jsx';
import Spinner from '../../../shared/components/ui/Spinner.jsx';

const EMPTY_FORM = { customerName: '', phone: '', partySize: 2, tableId: '', reservationDate: '', notes: '' };

export default function ReservationsPage() {
  const { hasPermission } = usePermission();
  const { filters, setFilters, editingReservation, setEditingReservation } = useReservationStore();
  const { data: reservations = [], isLoading } = useReservations();
  const { data: tables = [] } = useTables();
  const createRes  = useCreateReservation();
  const cancelRes  = useCancelReservation();
  const confirmRes = useConfirmReservation();
  const canCreate  = hasPermission(PERMISSIONS.RESERVATIONS_CREATE);
  const canEdit    = hasPermission(PERMISSIONS.RESERVATIONS_EDIT);
  const canCancel  = hasPermission(PERMISSIONS.RESERVATIONS_CANCEL);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(() => {
    let list = reservations;
    if (filters.status && filters.status !== 'all') list = list.filter(r => r.status === filters.status);
    if (filters.search) list = list.filter(r => r.customerName?.toLowerCase().includes(filters.search.toLowerCase()));
    return list;
  }, [reservations, filters]);

  const handleCreate = () => {
    createRes.mutate({ ...form, partySize: Number(form.partySize), tableId: Number(form.tableId) }, {
      onSuccess: () => { setEditingReservation(null); toast.success('Reservation created'); },
      onError: () => toast.error('Failed'),
    });
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Reservations</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>{filtered.filter(r => r.status === 'confirmed').length} confirmed</p>
        </div>
        {canCreate && (
          <button onClick={() => { setForm(EMPTY_FORM); setEditingReservation({}); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
            style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)', color: 'white' }}>
            <Plus size={16} /> New Reservation
          </button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1" style={{ background: 'white', border: '1px solid #E8D5C0' }}>
          <Search size={15} style={{ color: '#8B6E52' }} />
          <input value={filters.search || ''} onChange={e => setFilters({ search: e.target.value })}
            placeholder="Search..." className="bg-transparent text-sm outline-none flex-1" style={{ color: '#2C1810' }} />
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'confirmed', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilters({ status: s })} className="px-3 py-2 rounded-xl text-xs font-medium capitalize"
              style={filters.status === s ? { background: '#C8862A', color: 'white' } : { background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.length === 0
            ? <p className="col-span-3 text-center py-12 text-sm" style={{ color: '#8B6E52' }}>No reservations found.</p>
            : filtered.map(res => (
            <div key={res.reservationId} className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold" style={{ color: '#2C1810' }}>{res.customerName}</h3>
                  <p className="text-xs" style={{ color: '#8B6E52' }}>{res.phone} · Party of {res.partySize}</p>
                  <p className="text-xs mt-1" style={{ color: '#8B6E52' }}>{new Date(res.reservationDate).toLocaleString()}</p>
                </div>
                <Badge status={res.status} />
              </div>
              <div className="flex gap-2">
                {canEdit && res.status === 'pending' && (
                  <button onClick={() => confirmRes.mutate(res.reservationId, { onSuccess: () => toast.success('Confirmed') })}
                    className="flex-1 py-2 rounded-xl text-xs font-semibold text-white" style={{ background: '#059669' }}>
                    Confirm
                  </button>
                )}
                {canCancel && res.status !== 'cancelled' && (
                  <button onClick={() => cancelRes.mutate(res.reservationId, { onSuccess: () => toast.success('Cancelled') })}
                    className="flex-1 py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1"
                    style={{ background: '#FEF2F2', color: '#DC2626' }}>
                    <X size={12} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={!!editingReservation} onClose={() => setEditingReservation(null)} title="New Reservation" size="md"
        footer={
          <div className="flex gap-3">
            <button onClick={() => setEditingReservation(null)} className="flex-1 py-3 rounded-xl text-sm" style={{ background: '#F0E8DE', color: '#6B4F3A' }}>Cancel</button>
            <button onClick={handleCreate} disabled={createRes.isPending} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #C8862A, #8B3A0F)' }}>
              {createRes.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        }>
        <div className="space-y-4">
          {[
            { k: 'customerName', l: 'Guest Name', t: 'text' },
            { k: 'phone', l: 'Phone', t: 'tel' },
            { k: 'partySize', l: 'Party Size', t: 'number' },
            { k: 'reservationDate', l: 'Date & Time', t: 'datetime-local' },
          ].map(f => (
            <div key={f.k}>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>{f.l}</label>
              <input type={f.t} value={form[f.k]} onChange={e => setForm(p => ({ ...p, [f.k]: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810' }} />
            </div>
          ))}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#6B4F3A' }}>Table</label>
            <select value={form.tableId} onChange={e => setForm(p => ({ ...p, tableId: e.target.value }))}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{ border: '2px solid #E8D5C0', color: '#2C1810', background: 'white' }}>
              <option value="">Select table</option>
              {tables.filter(t => t.status === 'available').map(t => (
                <option key={t.tableId} value={t.tableId}>Table {t.number} ({t.capacity} seats)</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
