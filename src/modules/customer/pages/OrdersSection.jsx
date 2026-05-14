import React, { useState } from 'react';
import { Search, Clock, CheckCircle, XCircle } from 'lucide-react';
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

const CustomerOrdersSection = () => {
    const { orders, currentUser } = useApp();
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // Filter orders for current customer
    const customerOrders = orders.filter(order => order.customerId === currentUser.userId);

    const filteredOrders = customerOrders.filter(order => {
        const matchesSearch = order.orderId.toString().includes(search) ||
            order.customerName.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'paid':
                return <CheckCircle size={16} className="text-green-600" />;
            case 'cancelled':
                return <XCircle size={16} className="text-red-600" />;
            default:
                return <Clock size={16} className="text-yellow-600" />;
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold" style={{
                    color: 'var(--bg-dark-accent)',
                    fontFamily: "'Playfair Display', serif"
                }}>My Orders</h2>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="served">Served</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="grid gap-4">
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No orders found</h3>
                        <p className="text-gray-500">You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.orderId} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-semibold text-lg">Order #{order.orderId}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                                    </p>
                                    <p className="text-sm text-gray-600">Type: {order.type}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 mb-2">
                                        {getStatusIcon(order.status)}
                                        <span
                                            className="px-3 py-1 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor: statusColors[order.status]?.bg,
                                                color: statusColors[order.status]?.color
                                            }}
                                        >
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                    <p className="font-bold text-lg" style={{ color: 'var(--primary-gold)' }}>
                                        ETB {order.totalAmount.toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-medium text-gray-700">Items:</h4>
                                {order.items?.map(item => (
                                    <div key={item.orderItemId} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                        <div className="flex-1">
                                            <span className="font-medium">{item.itemName}</span>
                                            <span className="text-sm text-gray-600 ml-2">x{item.quantity}</span>
                                            {item.notes && <span className="text-sm text-gray-500 ml-2">({item.notes})</span>}
                                        </div>
                                        <span className="font-medium">ETB {item.subTotal.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>

                            {order.notes && (
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <strong>Notes:</strong> {order.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default CustomerOrdersSection;