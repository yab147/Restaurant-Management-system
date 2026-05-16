/**
 * Order Detail Page
 * Shows detailed view of a single order with edit capabilities
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderDetail, useUpdateOrder, useAddOrderItem, useDeleteOrder } from '../hooks/useOrders.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../../../permissions/matrix.js';
import { ORDER_STATUS_LABELS, STATUS_COLORS } from '../types/index.js';

export default function OrderDetailPage() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { hasPermission } = usePermission();

    const { data: order, isLoading, error } = useOrderDetail(orderId);
    const { mutate: updateOrder } = useUpdateOrder();
    const { mutate: deleteOrder } = useDeleteOrder();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        notes: '',
    });

    useEffect(() => {
        if (order) {
            setFormData({ notes: order.notes || '' });
        }
    }, [order]);

    const handleSave = () => {
        updateOrder(
            { orderId, payload: formData },
            {
                onSuccess: () => {
                    setIsEditing(false);
                },
            }
        );
    };

    const handleDelete = () => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            deleteOrder(orderId, {
                onSuccess: () => navigate('/orders'),
            });
        }
    };

    if (isLoading) return <div className="p-6">Loading order details...</div>;
    if (error) return <div className="p-6 text-red-600">Error loading order: {error.message}</div>;
    if (!order) return <div className="p-6">Order not found</div>;

    return (
        <div className="p-6 max-w-4xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">Order #{order.orderId}</h1>
                    <p className="text-gray-600 mt-1">
                        Created: {new Date(order.createdAt).toLocaleString()}
                    </p>
                </div>
                <div className="space-x-2">
                    {hasPermission(PERMISSIONS.ORDERS_EDIT) && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            {isEditing ? 'Cancel' : 'Edit'}
                        </button>
                    )}
                    {hasPermission(PERMISSIONS.ORDERS_DELETE) && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                    )}
                    <button
                        onClick={() => navigate('/orders')}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* Order Info Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Order Information</h2>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-gray-600 text-sm">Customer</p>
                        <p className="text-lg font-semibold">{order.customerName}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Type</p>
                        <p className="text-lg font-semibold capitalize">{order.type}</p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Status</p>
                        <p className={`text-lg font-semibold text-white px-3 py-1 rounded-lg w-fit bg-${STATUS_COLORS[order.status]}-600`}>
                            {ORDER_STATUS_LABELS[order.status]}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600 text-sm">Total</p>
                        <p className="text-lg font-semibold">${order.total?.toFixed(2) || '0.00'}</p>
                    </div>
                </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Items</h2>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Item</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Quantity</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Price</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {(order.items || []).map((item) => (
                                <tr key={item.itemId}>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            {item.specialInstructions && (
                                                <p className="text-sm text-gray-600 italic">
                                                    Note: {item.specialInstructions}
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{item.quantity}</td>
                                    <td className="px-4 py-3">${item.price?.toFixed(2) || '0.00'}</td>
                                    <td className="px-4 py-3 font-semibold">
                                        ${(item.quantity * item.price)?.toFixed(2) || '0.00'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Notes / Special Instructions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold mb-4">Notes</h2>
                {isEditing ? (
                    <div className="space-y-4">
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Special instructions or notes..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="4"
                        />
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                        >
                            Save Changes
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-700">{order.notes || 'No special instructions'}</p>
                )}
            </div>
        </div>
    );
}
