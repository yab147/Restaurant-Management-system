/**
 * Order List Page
 * Displays list of orders with filters, pagination, and actions
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders, useDeleteOrder, useUpdateOrderStatus } from '../hooks/useOrders.js';
import { useOrderStore } from '../store/useOrderStore.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import {
    ORDER_STATUSES,
    ORDER_STATUS_LABELS,
    ORDER_TYPES,
    ORDER_TYPE_LABELS,
    STATUS_COLORS,
} from '../types/index.js';

export default function OrderListPage() {
    const { filters, setFilters } = useOrderStore();
    const { hasPermission } = usePermission();

    const { data, isLoading, error } = useOrders(filters);
    const { mutate: deleteOrder, isLoading: isDeleting } = useDeleteOrder();
    const { mutate: updateStatus } = useUpdateOrderStatus();

    const [searchInput, setSearchInput] = useState('');

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
        setFilters({ search: e.target.value, page: 1 });
    };

    const handleStatusFilter = (status) => {
        setFilters({ status, page: 1 });
    };

    const handleDelete = (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            deleteOrder(orderId);
        }
    };

    const handleStatusUpdate = (orderId, newStatus) => {
        updateStatus({ orderId, status: newStatus });
    };

    const handlePagination = (page) => {
        setFilters({ page });
    };

    if (isLoading) return <div className="p-6">Loading orders...</div>;
    if (error) return <div className="p-6 text-red-600">Error loading orders: {error.message}</div>;

    const orders = data?.data || [];
    const total = data?.total || 0;
    const totalPages = Math.ceil(total / filters.size);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Orders</h1>
                {hasPermission(PERMISSIONS.ORDERS_CREATE) && (
                    <Link
                        to="/orders/new"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        New Order
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="mb-6 space-y-4">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by customer name or order ID..."
                        value={searchInput}
                        onChange={handleSearch}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => handleStatusFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium ${filters.status === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        All
                    </button>
                    {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => handleStatusFilter(value)}
                            className={`px-4 py-2 rounded-lg font-medium ${filters.status === value
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {ORDER_STATUS_LABELS[value]}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Order ID</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Customer</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                            {(hasPermission(PERMISSIONS.ORDERS_EDIT) ||
                                hasPermission(PERMISSIONS.ORDERS_DELETE)) && (
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                                )}
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => (
                                <tr key={order.orderId} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">
                                        <Link
                                            to={`/orders/${order.orderId}`}
                                            className="text-blue-600 hover:underline font-semibold"
                                        >
                                            #{order.orderId}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{order.customerName}</td>
                                    <td className="px-6 py-4 text-sm">{ORDER_TYPE_LABELS[order.type]}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {hasPermission(PERMISSIONS.ORDERS_EDIT) ? (
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                                                className={`px-3 py-1 rounded-lg text-sm font-medium text-white bg-${STATUS_COLORS[order.status]}-600`}
                                            >
                                                {Object.entries(ORDER_STATUSES).map(([key, value]) => (
                                                    <option key={key} value={value}>
                                                        {ORDER_STATUS_LABELS[value]}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`px-3 py-1 rounded-lg text-sm font-medium text-white bg-${STATUS_COLORS[order.status]}-600`}>
                                                {ORDER_STATUS_LABELS[order.status]}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold">${order.total?.toFixed(2) || '0.00'}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    {(hasPermission(PERMISSIONS.ORDERS_EDIT) ||
                                        hasPermission(PERMISSIONS.ORDERS_DELETE)) && (
                                            <td className="px-6 py-4 text-sm space-x-2">
                                                {hasPermission(PERMISSIONS.ORDERS_EDIT) && (
                                                    <Link
                                                        to={`/orders/${order.orderId}/edit`}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                )}
                                                {hasPermission(PERMISSIONS.ORDERS_DELETE) && (
                                                    <button
                                                        onClick={() => handleDelete(order.orderId)}
                                                        disabled={isDeleting}
                                                        className="text-red-600 hover:underline disabled:opacity-50"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                        onClick={() => handlePagination(Math.max(1, filters.page - 1))}
                        disabled={filters.page === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                        Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePagination(page)}
                            className={`px-4 py-2 rounded-lg ${filters.page === page
                                    ? 'bg-blue-600 text-white'
                                    : 'border border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePagination(Math.min(totalPages, filters.page + 1))}
                        disabled={filters.page === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
