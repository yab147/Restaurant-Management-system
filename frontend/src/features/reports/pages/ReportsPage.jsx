import React from 'react';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { useSalesReport, useTopItemsReport } from '../hooks/useReports.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import Spinner from '../../../shared/components/ui/Spinner.jsx';

export default function ReportsPage() {
  const { hasPermission } = usePermission();
  const canExport = hasPermission(PERMISSIONS.REPORTS_EXPORT);

  const { data: salesData = [], isLoading: loadingSales } = useSalesReport();
  const { data: topItems  = [], isLoading: loadingTop   } = useTopItemsReport();

  const totalRevenue = salesData.reduce((s, d) => s + (d.revenue || d.total || 0), 0);
  const totalOrders  = salesData.reduce((s, d) => s + (d.orders || d.count || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#2C1810', fontFamily: "'Playfair Display', serif" }}>Reports & Analytics</h2>
          <p className="text-sm" style={{ color: '#8B6E52' }}>Business performance overview</p>
        </div>
        {canExport && (
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#F0E8DE', color: '#6B4F3A' }}>
            <Download size={16} /> Export CSV
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Revenue', value: `ETB ${totalRevenue.toLocaleString()}`, icon: '💰', color: '#C8862A' },
          { label: 'Total Orders',  value: totalOrders, icon: '📋', color: '#0369A1' },
          { label: 'Top Item',      value: topItems[0]?.name || '–', icon: '⭐', color: '#059669' },
          { label: 'Avg Order',     value: totalOrders > 0 ? `ETB ${Math.round(totalRevenue / totalOrders)}` : '–', icon: '📊', color: '#7C3AED' },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium uppercase tracking-wide" style={{ color: '#8B6E52' }}>{kpi.label}</p>
              <span className="text-xl">{kpi.icon}</span>
            </div>
            <p className="text-2xl font-black truncate" style={{ color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#2C1810' }}>
          <TrendingUp size={18} style={{ color: '#C8862A' }} /> Revenue Trend
        </h3>
        {loadingSales ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : salesData.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: '#8B6E52' }}>No sales data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DE" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#8B6E52' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8B6E52' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F0E8DE' }} />
              <Line type="monotone" dataKey="revenue" stroke="#C8862A" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top items chart */}
      <div className="rounded-2xl p-5 shadow-sm" style={{ background: 'white', border: '1px solid #F0E8DE' }}>
        <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: '#2C1810' }}>
          <BarChart3 size={18} style={{ color: '#C8862A' }} /> Top Menu Items
        </h3>
        {loadingTop ? (
          <div className="flex justify-center py-10"><Spinner /></div>
        ) : topItems.length === 0 ? (
          <p className="text-center py-10 text-sm" style={{ color: '#8B6E52' }}>No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={topItems.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0E8DE" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#8B6E52' }} />
              <YAxis tick={{ fontSize: 11, fill: '#8B6E52' }} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #F0E8DE' }} />
              <Bar dataKey="totalSold" fill="#C8862A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
