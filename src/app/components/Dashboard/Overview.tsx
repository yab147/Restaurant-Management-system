import { TrendingUp, Users, DollarSign, ShoppingBag, ArrowUp } from 'lucide-react';

export function Overview() {
  const stats = [
    { label: 'Total Revenue', value: '45,280 ETB', change: '+12.5%', icon: DollarSign, bgColor: 'bg-green-50', iconColor: 'text-green-600', changeColor: 'text-green-600' },
    { label: 'Orders Today', value: '128', change: '+8.2%', icon: ShoppingBag, bgColor: 'bg-blue-50', iconColor: 'text-blue-600', changeColor: 'text-blue-600' },
    { label: 'Active Tables', value: '18/25', change: '72%', icon: Users, bgColor: 'bg-purple-50', iconColor: 'text-purple-600', changeColor: 'text-purple-600' },
    { label: 'Monthly Growth', value: '+23%', change: 'vs last month', icon: TrendingUp, bgColor: 'bg-orange-50', iconColor: 'text-orange-600', changeColor: 'text-orange-600' },
  ];

  const recentOrders = [
    { id: '#ORD-001', table: 'Table 5', items: 'Kitfo, Tej, Tibs', total: '850 ETB', status: 'Preparing', statusColor: 'bg-yellow-100 text-yellow-700' },
    { id: '#ORD-002', table: 'Table 12', items: 'Injera w/Doro Wat', total: '450 ETB', status: 'Ready', statusColor: 'bg-blue-100 text-blue-700' },
    { id: '#ORD-003', table: 'Table 3', items: 'Shiro, Coffee', total: '280 ETB', status: 'Delivered', statusColor: 'bg-green-100 text-green-700' },
    { id: '#ORD-004', table: 'Table 8', items: 'Fish Dulet, Beer', total: '620 ETB', status: 'Preparing', statusColor: 'bg-yellow-100 text-yellow-700' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${stat.changeColor}`}>
                <ArrowUp className="w-4 h-4" />
                {stat.change}
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-semibold text-indigo-600">{order.id}</span>
                    <span className="text-gray-300">•</span>
                    <span className="font-medium text-gray-900">{order.table}</span>
                  </div>
                  <p className="text-sm text-gray-500">{order.items}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-semibold text-gray-900 mb-1">{order.total}</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${order.statusColor}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Items Today</h3>
          <div className="space-y-3">
            {[
              { name: 'Kitfo', orders: 45, revenue: '22,500 ETB', percentage: 95 },
              { name: 'Doro Wat with Injera', orders: 38, revenue: '17,100 ETB', percentage: 78 },
              { name: 'Tibs', orders: 32, revenue: '19,200 ETB', percentage: 65 },
              { name: 'Shiro', orders: 28, revenue: '8,400 ETB', percentage: 55 },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.orders} orders</p>
                  </div>
                  <p className="font-bold text-indigo-600">{item.revenue}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
