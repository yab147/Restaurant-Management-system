import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, ShoppingBag, DollarSign, AlertTriangle, CheckCircle, ChefHat } from 'lucide-react';
import { useApp } from '../../context/AppContext';
const COLORS = ['#C8862A', '#8B3A0F', '#2C1810', '#059669', '#7C3AED'];
const AdminDashboard = () => {
  const {
    orders,
    tables,
    ingredients,
    reservations,
    salesData,
    topItems
  } = useApp();
  const totalRevenue = orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.totalAmount, 0);
  const activeOrders = orders.filter(o => !['paid', 'cancelled'].includes(o.status)).length;
  const availableTables = tables.filter(t => t.status === 'available').length;
  const lowStock = ingredients.filter(i => i.quantity <= i.threshold).length;
  const todayReservations = reservations.filter(r => r.status === 'confirmed').length;
  const stats = [{
    label: "Today's Revenue",
    value: `ETB ${totalRevenue.toLocaleString()}`,
    icon: <DollarSign size={20} />,
    color: '#059669',
    bg: '#ECFDF5',
    sub: '+12% from yesterday'
  }, {
    label: 'Active Orders',
    value: activeOrders,
    icon: <ShoppingBag size={20} />,
    color: '#D97706',
    bg: '#FFFBEB',
    sub: 'Across all tables'
  }, {
    label: 'Available Tables',
    value: `${availableTables}/${tables.length}`,
    icon: <ChefHat size={20} />,
    color: '#0369A1',
    bg: '#EFF6FF',
    sub: 'Ready to seat guests'
  }, {
    label: 'Low Stock Items',
    value: lowStock,
    icon: <AlertTriangle size={20} />,
    color: '#DC2626',
    bg: '#FEF2F2',
    sub: 'Needs restocking'
  }];
  const orderStatusData = [{
    name: 'Pending',
    value: orders.filter(o => o.status === 'pending').length
  }, {
    name: 'Preparing',
    value: orders.filter(o => o.status === 'preparing').length
  }, {
    name: 'Ready',
    value: orders.filter(o => o.status === 'ready').length
  }, {
    name: 'Served',
    value: orders.filter(o => o.status === 'served').length
  }, {
    name: 'Paid',
    value: orders.filter(o => o.status === 'paid').length
  }];
  return <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl p-6 flex items-center justify-between" style={{
      background: 'linear-gradient(135deg, #1A1008, #2C1810)',
      border: '1px solid rgba(200,134,42,0.2)'
    }}>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1" style={{
          fontFamily: "'Playfair Display', serif"
        }}>
            Good Morning, Admin! 👑
          </h2>
          <p style={{
          color: '#8B6E52'
        }}>Here's what's happening at Holy Restaurant today</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-white font-bold" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '1.1rem'
        }}>
            {new Date().toLocaleDateString('en-ET', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
          </p>
          <p style={{
          color: '#C8862A'
        }}>Dire Dawa, Ethiopia</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => <div key={i} className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
            background: stat.bg,
            color: stat.color
          }}>
                {stat.icon}
              </div>
              <TrendingUp size={14} style={{
            color: '#059669'
          }} />
            </div>
            <div className="text-2xl font-black mb-1" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>
              {stat.value}
            </div>
            <div className="text-xs font-semibold mb-0.5" style={{
          color: '#6B4F3A'
        }}>{stat.label}</div>
            <div className="text-xs" style={{
          color: '#B0926A'
        }}>{stat.sub}</div>
          </div>)}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
          <h3 className="font-bold text-base mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>
            Weekly Revenue (ETB)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData}>
              <XAxis dataKey="day" tick={{
              fontSize: 12,
              fill: '#8B6E52'
            }} axisLine={false} tickLine={false} />
              <YAxis tick={{
              fontSize: 11,
              fill: '#8B6E52'
            }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{
              borderRadius: 12,
              border: 'none',
              background: '#1A1008',
              color: 'white'
            }} />
              <Bar dataKey="revenue" fill="#C8862A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Order status pie */}
        <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
          <h3 className="font-bold text-base mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>
            Order Status
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={3}>
                {orderStatusData.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{
              borderRadius: 12,
              border: 'none'
            }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1">
            {orderStatusData.map((item, i) => <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{
                background: COLORS[i % COLORS.length]
              }} />
                  <span style={{
                color: '#6B4F3A'
              }}>{item.name}</span>
                </div>
                <span className="font-semibold" style={{
              color: '#2C1810'
            }}>{item.value}</span>
              </div>)}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top items */}
        <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
          <h3 className="font-bold text-base mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>
            🏆 Top Selling Items
          </h3>
          <div className="space-y-3">
            {topItems.map((item, i) => <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{
              background: i === 0 ? '#C8862A' : i === 1 ? '#8B6E52' : '#B0926A'
            }}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium" style={{
                  color: '#2C1810'
                }}>{item.name}</span>
                    <span style={{
                  color: '#C8862A'
                }} className="font-semibold">ETB {item.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{
                background: '#F0E8DE'
              }}>
                    <div className="h-1.5 rounded-full" style={{
                  background: '#C8862A',
                  width: `${item.orders / 210 * 100}%`
                }} />
                  </div>
                </div>
                <span className="text-xs" style={{
              color: '#8B6E52'
            }}>{item.orders} orders</span>
              </div>)}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
          <h3 className="font-bold text-base mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>
            📋 Recent Orders
          </h3>
          <div className="space-y-3">
            {orders.slice(0, 5).map(order => <div key={order.orderId} className="flex items-center justify-between p-3 rounded-xl" style={{
            background: '#FDF6EE',
            border: '1px solid #F0E8DE'
          }}>
                <div>
                  <p className="font-semibold text-sm" style={{
                color: '#2C1810'
              }}>#{order.orderId} – {order.customerName}</p>
                  <p className="text-xs" style={{
                color: '#8B6E52'
              }}>
                    {order.tableNumber ? `Table ${order.tableNumber}` : order.type} · {order.items.length} items
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{
                color: '#C8862A'
              }}>ETB {order.totalAmount}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium`} style={{
                background: order.status === 'paid' ? '#ECFDF5' : order.status === 'preparing' ? '#FFFBEB' : order.status === 'ready' ? '#EFF6FF' : '#FEF9EE',
                color: order.status === 'paid' ? '#059669' : order.status === 'preparing' ? '#D97706' : order.status === 'ready' ? '#0369A1' : '#C8862A'
              }}>
                    {order.status}
                  </span>
                </div>
              </div>)}
          </div>
        </div>
      </div>

      {/* Table Status & Low Stock */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
          <h3 className="font-bold text-base mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>
            🪑 Table Overview
          </h3>
          <div className="grid grid-cols-5 gap-2">
            {tables.map(table => <div key={table.tableId} className="rounded-xl p-2 text-center text-xs font-semibold" style={{
            background: table.status === 'available' ? '#ECFDF5' : table.status === 'occupied' ? '#FEE2E2' : table.status === 'reserved' ? '#FFFBEB' : '#F3F4F6',
            color: table.status === 'available' ? '#059669' : table.status === 'occupied' ? '#DC2626' : table.status === 'reserved' ? '#D97706' : '#6B7280'
          }}>
                T{table.number}
                <div className="text-xs opacity-70">{table.capacity}👤</div>
              </div>)}
          </div>
          <div className="flex flex-wrap gap-3 mt-4 text-xs">
            {[{
            color: '#059669',
            bg: '#ECFDF5',
            label: 'Available'
          }, {
            color: '#DC2626',
            bg: '#FEE2E2',
            label: 'Occupied'
          }, {
            color: '#D97706',
            bg: '#FFFBEB',
            label: 'Reserved'
          }, {
            color: '#6B7280',
            bg: '#F3F4F6',
            label: 'Cleaning'
          }].map((s, i) => <span key={i} className="flex items-center gap-1 px-2 py-1 rounded-full" style={{
            background: s.bg,
            color: s.color
          }}>
                <span className="w-2 h-2 rounded-full" style={{
              background: s.color
            }} />
                {s.label}
              </span>)}
          </div>
        </div>

        <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
          <h3 className="font-bold text-base mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>
            ⚠️ Low Stock Alerts
          </h3>
          <div className="space-y-3">
            {ingredients.filter(i => i.quantity <= i.threshold).map(ing => <div key={ing.ingredientId} className="flex items-center justify-between p-3 rounded-xl" style={{
            background: '#FEF2F2',
            border: '1px solid #FECACA'
          }}>
                <div>
                  <p className="font-semibold text-sm" style={{
                color: '#2C1810'
              }}>{ing.name}</p>
                  <div className="h-1.5 mt-1 rounded-full w-28" style={{
                background: '#FEE2E2'
              }}>
                    <div className="h-1.5 rounded-full" style={{
                  background: '#DC2626',
                  width: `${ing.quantity / ing.threshold * 100}%`
                }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-red-600">{ing.quantity} {ing.unit}</p>
                  <p className="text-xs text-red-400">Min: {ing.threshold} {ing.unit}</p>
                </div>
              </div>)}
            {ingredients.filter(i => i.quantity <= i.threshold).length === 0 && <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={16} /> <span className="text-sm">All items are well stocked!</span>
              </div>}
          </div>
        </div>
      </div>
    </div>;
};
export default AdminDashboard;