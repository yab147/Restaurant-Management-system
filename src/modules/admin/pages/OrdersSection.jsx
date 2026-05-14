import React, { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
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
  preparing: {
    bg: '#FFFBEB',
    color: '#D97706'
  },
  ready: {
    bg: '#F0FDF4',
    color: '#059669'
  },
  served: {
    bg: '#F3F4F6',
    color: '#6B7280'
  },
  paid: {
    bg: '#ECFDF5',
    color: '#059669'
  },
  cancelled: {
    bg: '#FEF2F2',
    color: '#DC2626'
  }
};
const statusFlow = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'served',
  served: 'paid'
};
const OrdersSection = () => {
  const {
    orders,
    setOrders,
    currentUser,
    tables,
    menuItems: allMenuItems
  } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrderForm, setNewOrderForm] = useState({
    customerName: '',
    tableId: '',
    type: 'dine-in',
    notes: ''
  });
  const [orderItems, setOrderItems] = useState([]);
  const canCreate = ['admin', 'manager', 'waiter'].includes(currentUser?.role || '');
  const canUpdateStatus = ['admin', 'manager', 'waiter', 'chef'].includes(currentUser?.role || '');
  const filtered = orders.filter(o => {
    const matchSearch = o.customerName.toLowerCase().includes(search.toLowerCase()) || o.orderId.toString().includes(search);
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });
  const updateStatus = async (orderId, newStatus) => {
    try {
      await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: newStatus
        })
      });
      setOrders(prev => prev.map(o => o.orderId === orderId ? {
        ...o,
        status: newStatus
      } : o));
      if (selectedOrder?.orderId === orderId) setSelectedOrder(prev => prev ? {
        ...prev,
        status: newStatus
      } : null);
    } catch (e) {
      console.error(e);
    }
  };
  const addItemToOrder = itemId => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.itemId === itemId);
      if (existing) return prev.map(i => i.itemId === itemId ? {
        ...i,
        qty: i.qty + 1
      } : i);
      return [...prev, {
        itemId,
        qty: 1
      }];
    });
  };
  const createOrder = async () => {
    if (!newOrderForm.customerName || orderItems.length === 0) return;
    const items = orderItems.map((oi, idx) => {
      const menu = allMenuItems.find(m => m.itemId === oi.itemId);
      return {
        orderItemId: Date.now() + idx,
        itemId: oi.itemId,
        itemName: menu.name,
        quantity: oi.qty,
        unitPrice: menu.price,
        subTotal: menu.price * oi.qty
      };
    });
    const total = items.reduce((s, i) => s + i.subTotal, 0);
    const table = tables.find(t => t.tableId === Number(newOrderForm.tableId));
    try {
      const response = await fetch('http://localhost:3001/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: newOrderForm.customerName,
          tableId: table?.tableId,
          tableNumber: table?.number,
          type: newOrderForm.type,
          totalAmount: total,
          notes: newOrderForm.notes,
          items: items
        })
      });
      const data = await response.json();
      if (data.success) {
        const newOrder = {
          orderId: data.orderId,
          customerName: newOrderForm.customerName,
          tableId: table?.tableId,
          tableNumber: table?.number,
          type: newOrderForm.type,
          status: 'pending',
          orderDate: new Date().toISOString(),
          items,
          totalAmount: total,
          notes: newOrderForm.notes
        };
        setOrders(prev => [newOrder, ...prev]);
        setShowNewOrder(false);
        setNewOrderForm({
          customerName: '',
          tableId: '',
          type: 'dine-in',
          notes: ''
        });
        setOrderItems([]);
      }
    } catch (e) {
      console.error(e);
    }
  };
  return <div className="p-6 space-y-5">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-black" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Orders</h2>
        <p className="text-sm" style={{
          color: '#8B6E52'
        }}>{orders.filter(o => !['paid', 'cancelled'].includes(o.status)).length} active orders</p>
      </div>
      {canCreate && <button onClick={() => setShowNewOrder(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105" style={{
        background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
        color: 'white'
      }}>
        <Plus size={16} /> New Order
      </button>}
    </div>

    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl flex-1" style={{
        background: 'white',
        border: '1px solid #E8D5C0'
      }}>
        <Search size={15} style={{
          color: '#8B6E52'
        }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className="bg-transparent text-sm outline-none flex-1" style={{
          color: '#2C1810'
        }} />
      </div>
      <div className="flex gap-2 flex-wrap">
        {['all', 'pending', 'confirmed', 'preparing', 'ready', 'served', 'paid', 'cancelled'].map(s => <button key={s} onClick={() => setStatusFilter(s)} className="px-3 py-2 rounded-xl text-xs font-medium capitalize transition-all" style={statusFilter === s ? {
          background: '#C8862A',
          color: 'white'
        } : {
          background: 'white',
          color: '#8B6E52',
          border: '1px solid #E8D5C0'
        }}>
          {s}
        </button>)}
      </div>
    </div>

    <div className="grid lg:grid-cols-2 gap-4">
      {filtered.map(order => {
        const sc = statusColors[order.status] || statusColors.pending;
        const nextStatus = statusFlow[order.status];
        return <div key={order.orderId} className="rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer" style={{
          background: 'white',
          border: '1px solid #F0E8DE'
        }} onClick={() => setSelectedOrder(order)}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-black text-base" style={{
                  color: '#2C1810',
                  fontFamily: "'Playfair Display', serif"
                }}>#{order.orderId}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold capitalize" style={sc}>{order.status}</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{
                  background: '#F5E6D3',
                  color: '#8B6E52'
                }}>{order.type}</span>
              </div>
              <p className="font-semibold text-sm" style={{
                color: '#2C1810'
              }}>{order.customerName}</p>
              <p className="text-xs" style={{
                color: '#8B6E52'
              }}>
                {order.tableNumber ? `Table ${order.tableNumber}` : order.type} · {new Date(order.orderDate).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-black text-lg" style={{
                color: '#C8862A',
                fontFamily: "'Playfair Display', serif"
              }}>ETB {order.totalAmount}</p>
              <p className="text-xs" style={{
                color: '#8B6E52'
              }}>{order.items.length} items</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {order.items.map(item => <span key={item.orderItemId} className="text-xs px-2 py-0.5 rounded-full" style={{
              background: '#F5E6D3',
              color: '#8B6E52'
            }}>
              {item.quantity}× {item.itemName}
            </span>)}
          </div>

          {canUpdateStatus && nextStatus && <button onClick={e => {
            e.stopPropagation();
            updateStatus(order.orderId, nextStatus);
          }} className="w-full py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90" style={{
            background: '#F0E8DE',
            color: '#8B3A0F'
          }}>
            → Mark as {nextStatus}
          </button>}
          {order.status === 'served' && currentUser?.role === 'cashier' && <button onClick={e => {
            e.stopPropagation();
            updateStatus(order.orderId, 'paid');
          }} className="w-full py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90" style={{
            background: 'linear-gradient(135deg, #059669, #065F46)',
            color: 'white'
          }}>
            ✓ Process Payment
          </button>}
        </div>;
      })}
    </div>

    {/* Order Detail Modal */}
    {selectedOrder && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'rgba(0,0,0,0.5)'
    }}>
      <div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto" style={{
        background: 'white'
      }}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-bold" style={{
            color: '#2C1810',
            fontFamily: "'Playfair Display', serif"
          }}>
            Order #{selectedOrder.orderId}
          </h3>
          <button onClick={() => setSelectedOrder(null)} style={{
            color: '#8B6E52'
          }}><X size={20} /></button>
        </div>
        <div className="space-y-3 mb-5">
          {[{
            label: 'Customer',
            value: selectedOrder.customerName
          }, {
            label: 'Table',
            value: selectedOrder.tableNumber ? `Table ${selectedOrder.tableNumber}` : 'N/A'
          }, {
            label: 'Type',
            value: selectedOrder.type
          }, {
            label: 'Status',
            value: selectedOrder.status
          }, {
            label: 'Time',
            value: new Date(selectedOrder.orderDate).toLocaleString()
          }, {
            label: 'Notes',
            value: selectedOrder.notes || '–'
          }].map(row => <div key={row.label} className="flex justify-between text-sm">
            <span style={{
              color: '#8B6E52'
            }}>{row.label}</span>
            <span className="font-medium capitalize" style={{
              color: '#2C1810'
            }}>{row.value}</span>
          </div>)}
        </div>
        <div className="border-t pt-4 mb-5" style={{
          borderColor: '#F0E8DE'
        }}>
          <h4 className="font-bold mb-3" style={{
            color: '#2C1810'
          }}>Items</h4>
          {selectedOrder.items.map(item => <div key={item.orderItemId} className="flex justify-between text-sm mb-2">
            <span style={{
              color: '#6B4F3A'
            }}>{item.quantity}× {item.itemName}</span>
            <span className="font-semibold" style={{
              color: '#C8862A'
            }}>ETB {item.subTotal}</span>
          </div>)}
          <div className="flex justify-between font-black text-lg pt-3 border-t" style={{
            borderColor: '#F0E8DE',
            color: '#2C1810'
          }}>
            <span>Total</span>
            <span style={{
              color: '#C8862A'
            }}>ETB {selectedOrder.totalAmount}</span>
          </div>
        </div>
        <button onClick={() => setSelectedOrder(null)} className="w-full py-3 rounded-xl text-sm font-medium" style={{
          background: '#F0E8DE',
          color: '#6B4F3A'
        }}>
          Close
        </button>
      </div>
    </div>}

    {/* New Order Modal */}
    {showNewOrder && <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{
      background: 'rgba(0,0,0,0.5)'
    }}>
      <div className="w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto" style={{
        background: 'white'
      }}>
        <div className="p-6 border-b" style={{
          borderColor: '#F0E8DE'
        }}>
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold" style={{
              color: '#2C1810',
              fontFamily: "'Playfair Display', serif"
            }}>New Order</h3>
            <button onClick={() => setShowNewOrder(false)} style={{
              color: '#8B6E52'
            }}><X size={20} /></button>
          </div>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold" style={{
              color: '#2C1810'
            }}>Order Details</h4>
            {[{
              label: 'Customer Name',
              key: 'customerName',
              type: 'text',
              placeholder: 'Customer name'
            }].map(field => <div key={field.key}>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
                color: '#6B4F3A'
              }}>{field.label}</label>
              <input type={field.type} placeholder={field.placeholder} value={newOrderForm[field.key]} onChange={e => setNewOrderForm(f => ({
                ...f,
                [field.key]: e.target.value
              }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
                border: '2px solid #E8D5C0',
                color: '#2C1810'
              }} />
            </div>)}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
                color: '#6B4F3A'
              }}>Order Type</label>
              <select value={newOrderForm.type} onChange={e => setNewOrderForm(f => ({
                ...f,
                type: e.target.value
              }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
                border: '2px solid #E8D5C0',
                color: '#2C1810',
                background: 'white'
              }}>
                <option value="dine-in">Dine In</option>
                <option value="takeaway">Takeaway</option>
                <option value="delivery">Delivery</option>
              </select>
            </div>
            {newOrderForm.type === 'dine-in' && <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
                color: '#6B4F3A'
              }}>Table</label>
              <select value={newOrderForm.tableId} onChange={e => setNewOrderForm(f => ({
                ...f,
                tableId: e.target.value
              }))} className="w-full px-4 py-3 rounded-xl text-sm outline-none" style={{
                border: '2px solid #E8D5C0',
                color: '#2C1810',
                background: 'white'
              }}>
                <option value="">Select table</option>
                {tables.filter(t => t.status === 'available').map(t => <option key={t.tableId} value={t.tableId}>Table {t.number} ({t.capacity} seats)</option>)}
              </select>
            </div>}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{
                color: '#6B4F3A'
              }}>Notes</label>
              <textarea value={newOrderForm.notes} onChange={e => setNewOrderForm(f => ({
                ...f,
                notes: e.target.value
              }))} rows={2} className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none" style={{
                border: '2px solid #E8D5C0',
                color: '#2C1810'
              }} />
            </div>
            {/* Selected items */}
            <div>
              <h4 className="font-semibold mb-2" style={{
                color: '#2C1810'
              }}>Selected Items</h4>
              {orderItems.length === 0 ? <p className="text-xs" style={{
                color: '#8B6E52'
              }}>No items selected</p> : <div className="space-y-2">
                {orderItems.map(oi => {
                  const menu = allMenuItems.find(m => m.itemId === oi.itemId);
                  return <div key={oi.itemId} className="flex items-center justify-between text-sm p-2 rounded-lg" style={{
                    background: '#FDF6EE'
                  }}>
                    <span style={{
                      color: '#2C1810'
                    }}>{menu.name}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setOrderItems(p => p.map(i => i.itemId === oi.itemId ? {
                        ...i,
                        qty: Math.max(0, i.qty - 1)
                      } : i).filter(i => i.qty > 0))} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
                        background: '#F0E8DE',
                        color: '#8B6E52'
                      }}>−</button>
                      <span className="font-bold" style={{
                        color: '#C8862A'
                      }}>{oi.qty}</span>
                      <button onClick={() => addItemToOrder(oi.itemId)} className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{
                        background: '#C8862A',
                        color: 'white'
                      }}>+</button>
                      <span className="text-xs ml-2" style={{
                        color: '#C8862A'
                      }}>ETB {menu.price * oi.qty}</span>
                    </div>
                  </div>;
                })}
                <div className="font-bold text-right" style={{
                  color: '#C8862A'
                }}>
                  Total: ETB {orderItems.reduce((s, oi) => {
                    const m = allMenuItems.find(m => m.itemId === oi.itemId);
                    return s + m.price * oi.qty;
                  }, 0)}
                </div>
              </div>}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{
              color: '#2C1810'
            }}>Select Items</h4>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {allMenuItems.filter(m => m.availability).map(item => <button key={item.itemId} onClick={() => addItemToOrder(item.itemId)} className="w-full flex items-center justify-between p-3 rounded-xl text-left transition-all hover:scale-[1.01]" style={{
                background: '#FDF6EE',
                border: '1px solid #F0E8DE'
              }}>
                <div>
                  <p className="font-medium text-sm" style={{
                    color: '#2C1810'
                  }}>{item.name}</p>
                  <p className="text-xs" style={{
                    color: '#8B6E52'
                  }}>ETB {item.price}</p>
                </div>
                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{
                  background: '#C8862A',
                  color: 'white'
                }}>+</div>
              </button>)}
            </div>
          </div>
        </div>
        <div className="p-6 border-t flex gap-3" style={{
          borderColor: '#F0E8DE'
        }}>
          <button onClick={() => setShowNewOrder(false)} className="flex-1 py-3 rounded-xl text-sm font-medium" style={{
            background: '#F0E8DE',
            color: '#6B4F3A'
          }}>Cancel</button>
          <button onClick={createOrder} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{
            background: 'linear-gradient(135deg, #C8862A, #8B3A0F)',
            color: 'white'
          }}>
            Create Order
          </button>
        </div>
      </div>
    </div>}
  </div>;
};
export default OrdersSection;