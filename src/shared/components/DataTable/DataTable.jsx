/**
 * DataTable — Reusable Table Engine
 *
 * WHY THIS EXISTS:
 * Every feature had its own table rendering (flex divs, ad-hoc sorting).
 * This engine gives ALL features: columns definition, sorting, empty state.
 *
 * USAGE:
 *   const columns = [
 *     { key: 'name',  header: 'Name',   render: row => row.name },
 *     { key: 'total', header: 'Amount', render: row => `ETB ${row.total}` },
 *   ];
 *   <DataTable columns={columns} data={orders} keyField="orderId" />
 */

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Spinner from '../ui/Spinner.jsx';

export default function DataTable({
  columns,
  data = [],
  keyField = 'id',
  isLoading = false,
  emptyMessage = 'No records found.',
  onRowClick,
  stickyHeader = true,
}) {
  const [sortKey,   setSortKey]   = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const av = a[sortKey]; const bv = b[sortKey];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border" style={{ borderColor: '#F0E8DE' }}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead style={{ background: '#F8F0E8' }}>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider
                    ${col.sortable !== false ? 'cursor-pointer select-none hover:bg-amber-50' : ''}`}
                  style={{ color: '#6B4F3A' }}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable !== false && sortKey === col.key && (
                      sortOrder === 'asc'
                        ? <ChevronUp size={12} />
                        : <ChevronDown size={12} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-12 text-sm"
                  style={{ color: '#8B6E52' }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              sorted.map((row, i) => (
                <tr
                  key={row[keyField] ?? i}
                  className={`border-t transition-colors
                    ${onRowClick ? 'cursor-pointer hover:bg-amber-50/50' : ''}`}
                  style={{ borderColor: '#F0E8DE' }}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className="px-4 py-3 text-sm"
                      style={{ color: '#2C1810' }}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
