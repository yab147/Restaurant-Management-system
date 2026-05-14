import React, { useState } from 'react';
import { Plus, Calendar, Phone, Users, X } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
const statusColors = {
  pending: {
    bg: '#FEF9EE',
    color: '#C8862A'
  },
  confirmed: {
    bg: '#EFF6FF',
    color: '#0369A1'
  },
  cancelled: {
    bg: '#FEF2F2',
    color: '#DC2626'
  },
  completed: {
    bg: '#ECFDF5',
    color: '#059669'
  }
};
const ReservationsSection = () => {
  const {
    reservations,
    setReservations,
    tables,
    currentUser
  } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    dateTime: '',
    guests: '2',
    tableId: ''
  });
  const handleSubmit = () => {
    if (!form.customerName || !form.phone || !form.dateTime) return;
    const newRes = {
      reservationId: Date.now(),
      customerName: form.customerName,
      phone: form.phone,
      dateTime: form.dateTime,
      guests: Number(form.guests),
      tableId: form.tableId ? Number(form.tableId) : undefined,
      status: 'pending'
    };
    setReservations(prev => [newRes, ...prev]);
    setShowForm(false);
    setForm({
      customerName: '',
      phone: '',
      dateTime: '',
      guests: '2',
      tableId: ''
    });
  };
  const updateStatus = (id, status) => {
    setReservations(prev => prev.map(r => r.reservationId === id ? {
      ...r,
      status
    } : r));
  };
  const canManage = ['admin', 'manager', 'waiter'].includes(currentUser?.role || '');
  const upcoming = reservations.filter(r => r.status !== 'cancelled' && r.status !== 'completed');
  const past = reservations.filter(r => r.status === 'completed' || r.status === 'cancelled');
  return <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Reservations</h2>
          <p className="text-sm" style={{
          color: '#8B6E52'
        }}>{upcoming.length} upcoming reservations</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{
        background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
        color: 'white'
      }}>
          <Plus size={16} /> New Reservation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[{
        label: 'Total',
        value: reservations.length,
        color: '#2C1810',
        bg: '#F5E6D3'
      }, {
        label: 'Pending',
        value: reservations.filter(r => r.status === 'pending').length,
        color: '#C8862A',
        bg: '#FEF9EE'
      }, {
        label: 'Confirmed',
        value: reservations.filter(r => r.status === 'confirmed').length,
        color: '#0369A1',
        bg: '#EFF6FF'
      }, {
        label: 'Today',
        value: reservations.filter(r => r.dateTime.startsWith(new Date().toISOString().split('T')[0])).length,
        color: '#059669',
        bg: '#ECFDF5'
      }].map((s, i) => <div key={i} className="rounded-2xl p-4 text-center" style={{
        background: s.bg
      }}>
            <div className="text-3xl font-black" style={{
          color: s.color,
          fontFamily: "'Playfair Display', serif"
        }}>{s.value}</div>
            <div className="text-xs font-medium" style={{
          color: s.color
        }}>{s.label}</div>
          </div>)}
      </div>

      <h3 className="font-bold text-lg" style={{
      color: '#2C1810',
      fontFamily: "'Playfair Display', serif"
    }}>Upcoming Reservations</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {upcoming.map(res => {
        const sc = statusColors[res.status];
        const tableInfo = tables.find(t => t.tableId === res.tableId);
        return <div key={res.reservationId} className="rounded-2xl p-5 shadow-sm" style={{
          background: 'white',
          border: '1px solid #F0E8DE'
        }}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold" style={{
                color: '#2C1810',
                fontFamily: "'Playfair Display', serif"
              }}>{res.customerName}</h4>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={sc}>{res.status}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm" style={{
                color: '#C8862A'
              }}>
                    {new Date(res.dateTime).toLocaleDateString('en-ET', {
                  month: 'short',
                  day: 'numeric'
                })}
                  </div>
                  <div className="text-xs" style={{
                color: '#8B6E52'
              }}>
                    {new Date(res.dateTime).toLocaleTimeString('en-ET', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-2" style={{
              color: '#6B4F3A'
            }}>
                  <Phone size={13} style={{
                color: '#C8862A'
              }} /> {res.phone}
                </div>
                <div className="flex items-center gap-2" style={{
              color: '#6B4F3A'
            }}>
                  <Users size={13} style={{
                color: '#C8862A'
              }} /> {res.guests} guests
                </div>
                <div className="flex items-center gap-2" style={{
              color: '#6B4F3A'
            }}>
                  <Calendar size={13} style={{
                color: '#C8862A'
              }} />
                  {tableInfo ? `Table ${tableInfo.number}` : 'No table'}
                </div>
              </div>

              {canManage && <div className="flex gap-2">
                  {res.status === 'pending' && <button onClick={() => updateStatus(res.reservationId, 'confirmed')} className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{
              background: '#EFF6FF',
              color: '#0369A1'
            }}>
                      ✓ Confirm
                    </button>}
                  {res.status === 'confirmed' && <button onClick={() => updateStatus(res.reservationId, 'completed')} className="flex-1 py-2 rounded-xl text-xs font-semibold" style={{
              background: '#ECFDF5',
              color: '#059669'
            }}>
                      ✓ Complete
                    </button>}
                  <button onClick={() => updateStatus(res.reservationId, 'cancelled')} className="flex-1 py-2 rounded-xl text-xs font-medium" style={{
              background: '#FEF2F2',
              color: '#DC2626'
            }}>
                    ✗ Cancel
                  </button>
                </div>}
            </div>;
      })}
      </div>

      {past.length > 0 && <>
          <h3 className="font-bold text-lg" style={{
        color: '#2C1810',
        fontFamily: "'Playfair Display', serif"
      }}>Past Reservations</h3>
          <div className="grid md:grid-cols-2 gap-4 opacity-60">
            {past.map(res => {
          const sc = statusColors[res.status];
          return <div key={res.reservationId} className="rounded-2xl p-4" style={{
            background: 'white',
            border: '1px solid #F0E8DE'
          }}>
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm" style={{
                  color: '#2C1810'
                }}>{res.customerName}</p>
                      <p className="text-xs" style={{
                  color: '#8B6E52'
                }}>{new Date(res.dateTime).toLocaleDateString()} · {res.guests} guests</p>
                    </div>
                    <span className="px-2 py-0.5 h-fit rounded-full text-xs font-semibold capitalize" style={sc}>{res.status}</span>
                  </div>
                </div>;
        })}
          </div>
        </>}

      {/* Form Modal */}
      {showForm && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'rgba(0,0,0,0.5)'
    }}>
          <div className="w-full max-w-md rounded-2xl p-6 shadow-2xl" style={{
        background: 'white'
      }}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold" style={{
            color: '#2C1810',
            fontFamily: "'Playfair Display', serif"
          }}>New Reservation</h3>
              <button onClick={() => setShowForm(false)} style={{
            color: '#8B6E52'
          }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              {[{
            label: 'Customer Name',
            key: 'customerName',
            type: 'text',
            placeholder: 'Full name'
          }, {
            label: 'Phone',
            key: 'phone',
            type: 'tel',
            placeholder: '+251...'
          }].map(f => <div key={f.key}>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
              color: '#6B4F3A'
            }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm(prev => ({
              ...prev,
              [f.key]: e.target.value
            }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
              border: '2px solid #E8D5C0',
              color: '#2C1810'
            }} />
                </div>)}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
                color: '#6B4F3A'
              }}>Date & Time</label>
                  <input type="datetime-local" value={form.dateTime} onChange={e => setForm(prev => ({
                ...prev,
                dateTime: e.target.value
              }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
                border: '2px solid #E8D5C0',
                color: '#2C1810'
              }} />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
                color: '#6B4F3A'
              }}>Guests</label>
                  <input type="number" min="1" max="20" value={form.guests} onChange={e => setForm(prev => ({
                ...prev,
                guests: e.target.value
              }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
                border: '2px solid #E8D5C0',
                color: '#2C1810'
              }} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
              color: '#6B4F3A'
            }}>Preferred Table</label>
                <select value={form.tableId} onChange={e => setForm(prev => ({
              ...prev,
              tableId: e.target.value
            }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
              border: '2px solid #E8D5C0',
              color: '#2C1810',
              background: 'white'
            }}>
                  <option value="">No preference</option>
                  {tables.map(t => <option key={t.tableId} value={t.tableId}>Table {t.number} ({t.capacity} seats)</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 rounded-xl text-sm" style={{
            background: '#F0E8DE',
            color: '#6B4F3A'
          }}>Cancel</button>
              <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{
            background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
            color: 'white'
          }}>
                Create Reservation
              </button>
            </div>
          </div>
        </div>}
    </div>;
};
export default ReservationsSection;