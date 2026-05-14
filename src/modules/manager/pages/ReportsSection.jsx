import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, TrendingDown } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
const COLORS = ['#C8862A', '#8B3A0F', '#2C1810', '#059669', '#7C3AED', '#0369A1'];
const ReportsSection = () => {
  const {
    orders,
    payments,
    salesData,
    topItems
  } = useApp();
  const [activeTab, setActiveTab] = useState('sales');
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalOrders = orders.length;
  const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;
  const paidOrders = orders.filter(o => o.status === 'paid').length;
  const paymentMethodData = [{
    name: 'Cash',
    value: payments.filter(p => p.method === 'cash').length
  }, {
    name: 'Card',
    value: payments.filter(p => p.method === 'card').length
  }, {
    name: 'Mobile',
    value: payments.filter(p => p.method === 'mobile').length
  }];
  const orderTypeData = [{
    name: 'Dine-In',
    value: orders.filter(o => o.type === 'dine-in').length
  }, {
    name: 'Takeaway',
    value: orders.filter(o => o.type === 'takeaway').length
  }, {
    name: 'Delivery',
    value: orders.filter(o => o.type === 'delivery').length
  }];
  return <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Reports & Analytics</h2>
          <p className="text-sm" style={{
          color: '#8B6E52'
        }}>Business performance insights for Holy Restaurant</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold" style={{
        background: '#F0E8DE',
        color: '#8B3A0F'
      }}>
          <Download size={16} /> Export Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[{
        label: 'Total Revenue',
        value: `ETB ${totalRevenue.toLocaleString()}`,
        change: '+15%',
        up: true,
        color: '#059669',
        bg: '#ECFDF5'
      }, {
        label: 'Total Orders',
        value: totalOrders,
        change: '+8%',
        up: true,
        color: '#0369A1',
        bg: '#EFF6FF'
      }, {
        label: 'Avg Order Value',
        value: `ETB ${avgOrderValue}`,
        change: '+3%',
        up: true,
        color: '#D97706',
        bg: '#FFFBEB'
      }, {
        label: 'Paid Orders',
        value: paidOrders,
        change: `${Math.round(paidOrders / Math.max(totalOrders, 1) * 100)}%`,
        up: true,
        color: '#7C3AED',
        bg: '#F5F3FF'
      }].map((kpi, i) => <div key={i} className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold" style={{
            color: '#8B6E52'
          }}>{kpi.label}</span>
              <span className={`text-xs flex items-center gap-0.5 font-semibold ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>
                {kpi.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-black" style={{
          color: kpi.color,
          fontFamily: "'Playfair Display', serif"
        }}>{kpi.value}</div>
          </div>)}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {['sales', 'orders', 'items'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className="px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all" style={activeTab === tab ? {
        background: '#C8862A',
        color: 'white'
      } : {
        background: 'white',
        color: '#8B6E52',
        border: '1px solid #E8D5C0'
      }}>
            {tab === 'sales' ? '📊 Sales' : tab === 'orders' ? '📋 Orders' : '🍽️ Menu Items'}
          </button>)}
      </div>

      {activeTab === 'sales' && <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <h3 className="font-bold mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Weekly Revenue (ETB)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C8862A" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C8862A" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="revenue" stroke="#C8862A" strokeWidth={2.5} fill="url(#revenueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <h3 className="font-bold mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Daily Orders Count</h3>
            <ResponsiveContainer width="100%" height={220}>
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
                <Bar dataKey="orders" fill="#8B3A0F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <h3 className="font-bold mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Payment Methods</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {paymentMethodData.map((_, idx) => <Cell key={idx} fill={COLORS[idx]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {paymentMethodData.map((item, i) => <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{
                background: COLORS[i]
              }} />
                    <span className="text-sm" style={{
                color: '#6B4F3A'
              }}>{item.name}</span>
                    <span className="font-bold text-sm ml-auto" style={{
                color: '#2C1810'
              }}>{item.value}</span>
                  </div>)}
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <h3 className="font-bold mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Order Types</h3>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="50%" height={160}>
                <PieChart>
                  <Pie data={orderTypeData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                    {orderTypeData.map((_, idx) => <Cell key={idx} fill={COLORS[idx + 3]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3">
                {orderTypeData.map((item, i) => <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{
                background: COLORS[i + 3]
              }} />
                    <span className="text-sm" style={{
                color: '#6B4F3A'
              }}>{item.name}</span>
                    <span className="font-bold text-sm ml-auto" style={{
                color: '#2C1810'
              }}>{item.value}</span>
                  </div>)}
              </div>
            </div>
          </div>
        </div>}

      {activeTab === 'items' && <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <h3 className="font-bold mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Top Items by Orders</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={topItems} layout="vertical">
                <XAxis type="number" tick={{
              fontSize: 11,
              fill: '#8B6E52'
            }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{
              fontSize: 11,
              fill: '#6B4F3A'
            }} axisLine={false} tickLine={false} width={100} />
                <Tooltip contentStyle={{
              borderRadius: 12,
              border: 'none',
              background: '#1A1008',
              color: 'white'
            }} />
                <Bar dataKey="orders" fill="#C8862A" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-2xl p-5 shadow-sm" style={{
        background: 'white',
        border: '1px solid #F0E8DE'
      }}>
            <h3 className="font-bold mb-4" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>Revenue by Item (ETB)</h3>
            <div className="space-y-4">
              {topItems.map((item, i) => <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium" style={{
                color: '#2C1810'
              }}>{item.name}</span>
                    <span className="font-bold" style={{
                color: '#C8862A'
              }}>ETB {item.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{
              background: '#F0E8DE'
            }}>
                    <div className="h-2 rounded-full" style={{
                background: COLORS[i % COLORS.length],
                width: `${item.revenue / 44800 * 100}%`
              }} />
                  </div>
                  <p className="text-xs mt-0.5" style={{
              color: '#B0926A'
            }}>{item.orders} orders</p>
                </div>)}
            </div>
          </div>
        </div>}

      {activeTab === 'orders' && <div className="rounded-2xl overflow-hidden shadow-sm" style={{
      background: 'white',
      border: '1px solid #F0E8DE'
    }}>
          <div className="px-5 py-4" style={{
        background: '#F5E6D3'
      }}>
            <h3 className="font-bold" style={{
          color: '#2C1810',
          fontFamily: "'Playfair Display', serif"
        }}>All Orders Report</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{
            background: '#FAF0E6'
          }}>
                {['Order ID', 'Customer', 'Type', 'Items', 'Total', 'Status', 'Date'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{
              color: '#6B4F3A'
            }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => <tr key={order.orderId} className="border-t hover:bg-amber-50/30" style={{
            borderColor: '#F0E8DE'
          }}>
                  <td className="px-4 py-3 font-bold" style={{
              color: '#C8862A'
            }}>#{order.orderId}</td>
                  <td className="px-4 py-3" style={{
              color: '#2C1810'
            }}>{order.customerName}</td>
                  <td className="px-4 py-3 capitalize" style={{
              color: '#8B6E52'
            }}>{order.type}</td>
                  <td className="px-4 py-3" style={{
              color: '#8B6E52'
            }}>{order.items.length}</td>
                  <td className="px-4 py-3 font-semibold" style={{
              color: '#C8862A'
            }}>ETB {order.totalAmount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize
                      ${order.status === 'paid' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-600' : order.status === 'preparing' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{
              color: '#8B6E52'
            }}>{new Date(order.orderDate).toLocaleString()}</td>
                </tr>)}
            </tbody>
          </table>
        </div>}
    </div>;
};
export default ReportsSection;