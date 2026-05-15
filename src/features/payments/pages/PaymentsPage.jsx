import React, { useMemo } from 'react';
import { Search, CreditCard, RefreshCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { usePayments, useRefundPayment } from '../hooks/usePayments.js';
import { usePaymentStore } from '../store/usePaymentStore.js';
import { usePermission }  from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS }    from '../../../permissions/matrix.js';
import Badge              from '../../../shared/components/ui/Badge.jsx';
import Spinner            from '../../../shared/components/ui/Spinner.jsx';
import DataTable          from '../../../shared/components/DataTable/DataTable.jsx';

export default function PaymentsPage() {
  const { hasPermission } = usePermission();
  const { filters, setFilters } = usePaymentStore();

  const { data: payments = [], isLoading } = usePayments(filters);
  const refund = useRefundPayment();

  const canRefund = hasPermission(PERMISSIONS.PAYMENTS_REFUND);

  const filtered = useMemo(() => {
    let list = payments;
    if (filters.status && filters.status !== 'all') list = list.filter(p => p.status === filters.status);
    if (filters.search) list = list.filter(p => String(p.paymentId).includes(filters.search) || p.method?.toLowerCase().includes(filters.search.toLowerCase()));
    return list;
  }, [payments, filters]);

  const todayTotal = useMemo(() => {
    const today = new Date().toDateString();
    return payments.filter(p => p.status === 'completed' && new Date(p.paymentDate).toDateString() === today)
      .reduce((sum, p) => sum + (p.amount || 0), 0);
  }, [payments]);

  const columns = [
    { key: 'paymentId',   header: 'ID',      render: r => `#${r.paymentId}` },
    { key: 'orderId',     header: 'Order',   render: r => `#${r.orderId}` },
    { key: 'amount',      header: 'Amount',  render: r => <span className="font-bold" style={{ color: '#C8862A' }}>ETB {r.amount}</span> },
    { key: 'method',      header: 'Method',  render: r => <span className="capitalize">{r.method}</span> },
    { key: 'status',      header: 'Status',  render: r => <Badge status={r.status} /> },
    { key: 'paymentDate', header: 'Date',    render: r => new Date(r.paymentDate).toLocaleString() },
    ...(canRefund ? [{
      key: 'actions', header: '', sortable: false,
      render: r => r.status === 'completed' ? (
        <button onClick={() => refund.mutate(r.paymentId, { onSuccess: () => toast.success('Refunded'), onError: () => toast.error('Refund failed') })}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
          style={{ background: '#7C3AED', color: 'white' }}>
          <RefreshCcw size={12} /> Refund
        </button>
      ) : null,
    }] : []),
  ];

  return (
    <div className="p-6 space-y-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Payments</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>Today's revenue: <strong style={{ color: '#059669' }}>ETB {todayTotal.toLocaleString()}</strong></p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Payments', value: payments.length, color: '#C8862A', icon: <CreditCard size={20} /> },
          { label: "Today's Revenue", value: `ETB ${todayTotal.toLocaleString()}`, color: '#059669', icon: '📈' },
          { label: 'Completed',  value: payments.filter(p => p.status === 'completed').length,  color: '#059669', icon: '✓' },
          { label: 'Refunded',   value: payments.filter(p => p.status === 'refunded').length,   color: '#7C3AED', icon: '↩' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8B6E52' }}>{s.label}</p>
              <span style={{ color: s.color }}>{s.icon}</span>
            </div>
            <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1" style={{ background: 'white', border: '1px solid #E8D5C0' }}>
          <Search size={15} style={{ color: '#8B6E52' }} />
          <input value={filters.search || ''} onChange={e => setFilters({ search: e.target.value })}
            placeholder="Search payments..." className="bg-transparent text-sm outline-none flex-1" style={{ color: '#2C1810' }} />
        </div>
        <div className="flex gap-2">
          {['all', 'completed', 'refunded', 'failed'].map(s => (
            <button key={s} onClick={() => setFilters({ status: s })} className="px-3 py-2 rounded-xl text-xs font-medium capitalize"
              style={filters.status === s ? { background: '#C8862A', color: 'white' } : { background: 'white', color: '#8B6E52', border: '1px solid #E8D5C0' }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <DataTable columns={columns} data={filtered} keyField="paymentId" isLoading={isLoading} emptyMessage="No payments found." />
    </div>
  );
}
