import { type FormEvent, useState } from 'react';
import { Plus, Search } from 'lucide-react';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered';

interface Order {
  id: string;
  table: string;
  customer: string;
  items: string;
  total: string;
  status: OrderStatus;
  time: string;
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    { id: '#ORD-001', table: 'Table 5', customer: 'Walk-in', items: 'Kitfo, Tej, Tibs', total: '850 ETB', status: 'preparing', time: '10:30 AM' },
    { id: '#ORD-002', table: 'Table 12', customer: 'Reservation', items: 'Injera w/Doro Wat, Coffee', total: '450 ETB', status: 'ready', time: '10:45 AM' },
    { id: '#ORD-003', table: 'Table 3', customer: 'Walk-in', items: 'Shiro, Coffee', total: '280 ETB', status: 'delivered', time: '11:00 AM' },
    { id: '#ORD-004', table: 'Table 8', customer: 'Walk-in', items: 'Fish Dulet, Beer', total: '620 ETB', status: 'preparing', time: '11:15 AM' },
    { id: '#ORD-005', table: 'Table 15', customer: 'Reservation', items: 'Mixed Grill, Wine', total: '1,250 ETB', status: 'pending', time: '11:20 AM' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [newOrder, setNewOrder] = useState({
    table: '',
    customer: 'Walk-in',
    items: '',
    total: '',
  });

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'ready': return 'bg-blue-100 text-blue-700';
      case 'preparing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredOrders = orders.filter((order) => {
    const searchText = `${order.id} ${order.table} ${order.customer} ${order.items} ${order.status}`.toLowerCase();
    return searchText.includes(searchTerm.toLowerCase());
  });

  const addOrder = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextOrderNumber = orders.length + 1;
    const order: Order = {
      id: `#ORD-${String(nextOrderNumber).padStart(3, '0')}`,
      table: newOrder.table,
      customer: newOrder.customer,
      items: newOrder.items,
      total: `${newOrder.total} ETB`,
      status: 'pending',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setOrders([order, ...orders]);
    setNewOrder({ table: '', customer: 'Walk-in', items: '', total: '' });
    setShowNewOrder(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-500">Track and manage all restaurant orders</p>
        </div>
        <button
          onClick={() => setShowNewOrder(true)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-200 flex items-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          New Order
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Table</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Customer</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Items</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Time</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Total</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-4 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4 font-semibold text-indigo-600">{order.id}</td>
                  <td className="py-4 px-4 font-medium text-gray-900">{order.table}</td>
                  <td className="py-4 px-4 text-gray-600">{order.customer}</td>
                  <td className="py-4 px-4 text-gray-600 max-w-xs truncate">{order.items}</td>
                  <td className="py-4 px-4 text-gray-500 text-sm">{order.time}</td>
                  <td className="py-4 px-4 font-semibold text-gray-900">{order.total}</td>
                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="py-4 px-4">
                    <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <p className="py-10 text-center text-gray-500">No orders match your search.</p>
          )}
        </div>
      </div>

      {showNewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="mb-5 text-2xl font-bold text-gray-900">Create Order</h2>
            <form onSubmit={addOrder} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  required
                  type="text"
                  placeholder="Table, e.g. Table 9"
                  value={newOrder.table}
                  onChange={(event) => setNewOrder({ ...newOrder, table: event.target.value })}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <select
                  value={newOrder.customer}
                  onChange={(event) => setNewOrder({ ...newOrder, customer: event.target.value })}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Walk-in</option>
                  <option>Reservation</option>
                  <option>Delivery</option>
                </select>
              </div>
              <input
                required
                type="text"
                placeholder="Items"
                value={newOrder.items}
                onChange={(event) => setNewOrder({ ...newOrder, items: event.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                required
                min="1"
                type="number"
                placeholder="Total amount"
                value={newOrder.total}
                onChange={(event) => setNewOrder({ ...newOrder, total: event.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewOrder(false)}
                  className="flex-1 rounded-xl bg-gray-100 px-5 py-3 font-medium text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-3 font-medium text-white"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
