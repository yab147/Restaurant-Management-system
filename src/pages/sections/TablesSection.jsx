import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
const statusConfig = {
  available: {
    color: '#059669',
    bg: '#ECFDF5',
    label: 'Available',
    emoji: '🟢'
  },
  occupied: {
    color: '#DC2626',
    bg: '#FEF2F2',
    label: 'Occupied',
    emoji: '🔴'
  },
  reserved: {
    color: '#D97706',
    bg: '#FFFBEB',
    label: 'Reserved',
    emoji: '🟡'
  },
  cleaning: {
    color: '#6B7280',
    bg: '#F3F4F6',
    label: 'Cleaning',
    emoji: '⚪'
  }
};
const TablesSection = () => {
  const {
    tables,
    setTables,
    orders,
    currentUser
  } = useApp();
  const [editTable, setEditTable] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    number: '',
    capacity: ''
  });
  const canEdit = ['admin', 'manager'].includes(currentUser?.role || '');
  const getTableOrder = tableId => orders.find(o => o.tableId === tableId && !['paid', 'cancelled'].includes(o.status));
  const changeStatus = (tableId, status) => {
    setTables(prev => prev.map(t => t.tableId === tableId ? {
      ...t,
      status
    } : t));
    setEditTable(null);
  };
  const addTable = () => {
    if (!form.number || !form.capacity) return;
    const newTable = {
      tableId: Date.now(),
      number: Number(form.number),
      capacity: Number(form.capacity),
      status: 'available'
    };
    setTables(prev => [...prev, newTable]);
    setShowAdd(false);
    setForm({
      number: '',
      capacity: ''
    });
  };
  const stats = [{
    label: 'Total',
    value: tables.length,
    color: '#2C1810',
    bg: '#F5E6D3'
  }, {
    label: 'Available',
    value: tables.filter(t => t.status === 'available').length,
    color: '#059669',
    bg: '#ECFDF5'
  }, {
    label: 'Occupied',
    value: tables.filter(t => t.status === 'occupied').length,
    color: '#DC2626',
    bg: '#FEF2F2'
  }, {
    label: 'Reserved',
    value: tables.filter(t => t.status === 'reserved').length,
    color: '#D97706',
    bg: '#FFFBEB'
  }];
  return <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Table Management</h2>
          <p className="text-sm" style={{
          color: '#8B6E52'
        }}>Real-time table status and assignments</p>
        </div>
        {canEdit && <button onClick={() => setShowAdd(true)} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{
        background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
        color: 'white'
      }}>
            + Add Table
          </button>}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {stats.map((s, i) => <div key={i} className="rounded-2xl p-4 text-center" style={{
        background: s.bg,
        border: `1px solid ${s.color}20`
      }}>
            <div className="text-3xl font-black" style={{
          color: s.color,
          fontFamily: "'Playfair Display', serif"
        }}>{s.value}</div>
            <div className="text-xs font-medium mt-1" style={{
          color: s.color
        }}>{s.label}</div>
          </div>)}
      </div>

      {/* Floor Plan */}
      <div className="rounded-2xl p-6" style={{
      background: 'white',
      border: '1px solid #F0E8DE'
    }}>
        <h3 className="font-bold mb-6" style={{
        color: '#2C1810',
        fontFamily: "'Playfair Display', serif"
      }}>
          🏠 Restaurant Floor Plan
        </h3>

        {/* Room decoration */}
        <div className="relative p-6 rounded-2xl" style={{
        background: '#FDF6EE',
        border: '2px dashed #E8D5C0',
        minHeight: '420px'
      }}>
          {/* Entrance */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 px-4 py-1 text-xs font-bold rounded-t-lg" style={{
          background: '#2C1810',
          color: '#C8862A',
          letterSpacing: '0.15em'
        }}>ENTRANCE</div>

          {/* Kitchen */}
          <div className="absolute top-4 right-4 px-4 py-2 rounded-xl text-xs font-bold" style={{
          background: '#1A1008',
          color: '#C8862A',
          border: '1px solid #C8862A'
        }}>
            👨‍🍳 KITCHEN
          </div>

          {/* Tables grid */}
          <div className="grid grid-cols-5 gap-4 pr-20 pt-4 pb-8">
            {tables.map(table => {
            const cfg = statusConfig[table.status];
            const activeOrder = getTableOrder(table.tableId);
            return <div key={table.tableId} className="flex flex-col items-center cursor-pointer group" onClick={() => canEdit && setEditTable(table)}>
                  {/* Table visual */}
                  <div className="relative transition-all group-hover:scale-105">
                    <div className={`rounded-xl flex flex-col items-center justify-center shadow-md transition-all
                      ${table.capacity >= 8 ? 'w-20 h-16' : table.capacity >= 6 ? 'w-18 h-14' : 'w-16 h-12'}`} style={{
                  background: cfg.bg,
                  border: `2px solid ${cfg.color}`,
                  width: table.capacity >= 6 ? '72px' : '60px',
                  height: table.capacity >= 6 ? '56px' : '48px'
                }}>
                      <div className="text-lg font-black leading-none" style={{
                    color: cfg.color,
                    fontFamily: "'Playfair Display', serif"
                  }}>
                        {table.number}
                      </div>
                      <div className="text-xs" style={{
                    color: cfg.color
                  }}>
                        {Array(Math.min(table.capacity, 6)).fill('•').join('')}
                      </div>
                    </div>
                    {/* Chairs representation */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {Array(Math.min(Math.ceil(table.capacity / 2), 3)).fill(null).map((_, i) => <div key={i} className="w-3 h-3 rounded-full border" style={{
                    background: cfg.bg,
                    borderColor: cfg.color
                  }} />)}
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                      {Array(Math.min(Math.floor(table.capacity / 2), 3)).fill(null).map((_, i) => <div key={i} className="w-3 h-3 rounded-full border" style={{
                    background: cfg.bg,
                    borderColor: cfg.color
                  }} />)}
                    </div>
                  </div>
                  <div className="mt-3 text-center">
                    <div className="text-xs font-semibold" style={{
                  color: cfg.color
                }}>{cfg.label}</div>
                    <div className="text-xs" style={{
                  color: '#B0926A'
                }}>{table.capacity} seats</div>
                    {activeOrder && <div className="text-xs mt-0.5 px-1.5 py-0.5 rounded" style={{
                  background: '#FEF9EE',
                  color: '#C8862A'
                }}>
                        #{activeOrder.orderId}
                      </div>}
                  </div>
                </div>;
          })}
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="rounded-2xl overflow-hidden" style={{
      background: 'white',
      border: '1px solid #F0E8DE'
    }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{
            background: '#F5E6D3'
          }}>
              {['Table #', 'Capacity', 'Status', 'Current Order', 'Revenue', canEdit ? 'Actions' : ''].filter(Boolean).map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{
              color: '#6B4F3A'
            }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {tables.map((table, i) => {
            const cfg = statusConfig[table.status];
            const activeOrder = getTableOrder(table.tableId);
            return <tr key={table.tableId} className="border-t transition-colors hover:bg-amber-50/30" style={{
              borderColor: '#F0E8DE'
            }}>
                  <td className="px-4 py-3 font-bold" style={{
                color: '#2C1810'
              }}>Table {table.number}</td>
                  <td className="px-4 py-3" style={{
                color: '#6B4F3A'
              }}>{table.capacity} persons</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-semibold" style={cfg}>{cfg.label}</span>
                  </td>
                  <td className="px-4 py-3" style={{
                color: '#6B4F3A'
              }}>
                    {activeOrder ? `#${activeOrder.orderId} – ${activeOrder.customerName}` : '–'}
                  </td>
                  <td className="px-4 py-3 font-semibold" style={{
                color: '#C8862A'
              }}>
                    {activeOrder ? `ETB ${activeOrder.totalAmount}` : '–'}
                  </td>
                  {canEdit && <td className="px-4 py-3">
                      <button onClick={() => setEditTable(table)} className="text-xs px-3 py-1 rounded-lg font-medium" style={{
                  background: '#F0E8DE',
                  color: '#8B3A0F'
                }}>Manage</button>
                    </td>}
                </tr>;
          })}
          </tbody>
        </table>
      </div>

      {/* Edit Table Modal */}
      {editTable && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'rgba(0,0,0,0.5)'
    }}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{
        background: 'white'
      }}>
            <h3 className="text-xl font-bold mb-5" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>
              Table {editTable.number} – Update Status
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {Object.keys(statusConfig).map(status => {
            const cfg = statusConfig[status];
            return <button key={status} onClick={() => changeStatus(editTable.tableId, status)} className="p-4 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{
              background: editTable.status === status ? cfg.bg : '#F5F5F5',
              color: editTable.status === status ? cfg.color : '#6B4F3A',
              border: `2px solid ${editTable.status === status ? cfg.color : 'transparent'}`
            }}>
                    {cfg.emoji} {cfg.label}
                  </button>;
          })}
            </div>
            <button onClick={() => setEditTable(null)} className="w-full py-3 rounded-xl text-sm font-medium" style={{
          background: '#F0E8DE',
          color: '#6B4F3A'
        }}>Close</button>
          </div>
        </div>}

      {/* Add Table Modal */}
      {showAdd && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'rgba(0,0,0,0.5)'
    }}>
          <div className="w-full max-w-sm rounded-2xl p-6 shadow-2xl" style={{
        background: 'white'
      }}>
            <h3 className="text-xl font-bold mb-5" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Add New Table</h3>
            <div className="space-y-4 mb-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
              color: '#6B4F3A'
            }}>Table Number</label>
                <input type="number" value={form.number} onChange={e => setForm(f => ({
              ...f,
              number: e.target.value
            }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
              border: '2px solid #E8D5C0',
              color: '#2C1810'
            }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
              color: '#6B4F3A'
            }}>Capacity (persons)</label>
                <input type="number" value={form.capacity} onChange={e => setForm(f => ({
              ...f,
              capacity: e.target.value
            }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
              border: '2px solid #E8D5C0',
              color: '#2C1810'
            }} />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-3 rounded-xl text-sm" style={{
            background: '#F0E8DE',
            color: '#6B4F3A'
          }}>Cancel</button>
              <button onClick={addTable} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{
            background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
            color: 'white'
          }}>Add Table</button>
            </div>
          </div>
        </div>}
    </div>;
};
export default TablesSection;