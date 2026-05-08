import { TrendingUp, DollarSign, ShoppingCart, Users } from 'lucide-react';

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
        <p className="text-gray-500">Track performance and insights</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Revenue This Month', value: '287,420 ETB', change: '+18.3%', icon: DollarSign, color: 'from-green-500 to-green-600' },
          { label: 'Total Orders', value: '1,284', change: '+12.5%', icon: ShoppingCart, color: 'from-blue-500 to-blue-600' },
          { label: 'Avg Order Value', value: '224 ETB', change: '+5.2%', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
          { label: 'Total Customers', value: '856', change: '+21.4%', icon: Users, color: 'from-orange-500 to-orange-600' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white border border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-green-600">{stat.change}</span>
            </div>
            <p className="text-gray-500 text-sm font-semibold mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Top Selling Items</h3>
          <div className="space-y-4">
            {[
              { name: 'Kitfo', sales: 245, revenue: '122,500 ETB', percentage: 95 },
              { name: 'Doro Wat', sales: 198, revenue: '89,100 ETB', percentage: 78 },
              { name: 'Tibs', sales: 187, revenue: '112,200 ETB', percentage: 74 },
              { name: 'Shiro', sales: 156, revenue: '46,800 ETB', percentage: 62 },
              { name: 'Fish Dulet', sales: 134, revenue: '80,400 ETB', percentage: 53 },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900">{item.name}</span>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-600">{item.revenue}</p>
                    <p className="text-xs text-gray-500">{item.sales} orders</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue by Category</h3>
          <div className="space-y-4">
            {[
              { category: 'Main Course', revenue: '165,400 ETB', percentage: 58 },
              { category: 'Beverages', revenue: '68,200 ETB', percentage: 24 },
              { category: 'Vegetarian', revenue: '34,620 ETB', percentage: 12 },
              { category: 'Desserts', revenue: '19,200 ETB', percentage: 6 },
            ].map((cat, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{cat.category}</span>
                  <span className="font-semibold text-indigo-600">{cat.revenue}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                      style={{ width: `${cat.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-500">{cat.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Peak Hours</h3>
        <div className="grid grid-cols-12 gap-2 items-end h-64">
          {[
            { hour: '9AM', orders: 12 },
            { hour: '10AM', orders: 18 },
            { hour: '11AM', orders: 24 },
            { hour: '12PM', orders: 45 },
            { hour: '1PM', orders: 52 },
            { hour: '2PM', orders: 38 },
            { hour: '3PM', orders: 28 },
            { hour: '4PM', orders: 22 },
            { hour: '5PM', orders: 30 },
            { hour: '6PM', orders: 48 },
            { hour: '7PM', orders: 62 },
            { hour: '8PM', orders: 54 },
          ].map((data, idx) => {
            const maxOrders = 62;
            const height = (data.orders / maxOrders) * 100;
            return (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-indigo-500 to-purple-600 rounded-t-lg transition-all duration-500 hover:opacity-80 relative group"
                  style={{ height: `${height}%` }}
                >
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity">
                    {data.orders}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{data.hour}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
