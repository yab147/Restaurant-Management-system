/**
 * Orders Feature - API Layer
 * Handles all orders domain API calls
 * All feature-specific API logic goes here
 */

import apiClient from '../../../services/api/axios.js';

// Fetch paginated orders with filters
export const fetchOrders = async ({
    page = 1,
    size = 25,
    sortBy = 'orderDate',
    sortOrder = 'DESC',
    status,
    tableId,
    waiterId,
    unassigned,
    startDate,
    endDate,
} = {}) => {
    const { data } = await apiClient.get('/orders', {
        params: {
            page,
            size,
            sortBy,
            sortOrder,
            ...(status && status !== 'all' ? { status } : {}),
            ...(tableId && { tableId }),
            ...(waiterId !== undefined && waiterId !== null ? { waiterId } : {}),
            ...(unassigned ? { unassigned } : {}),
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
        },
    });
    return data;
};

// Fetch single order by ID
export const fetchOrderById = async (orderId) => {
    const { data } = await apiClient.get(`/orders/${orderId}`);
    return data;
};

// Create new order
export const createOrder = async (payload) => {
    const { data } = await apiClient.post('/orders', payload);
    return data;
};

// Update order
export const updateOrder = async (orderId, payload) => {
    const { data } = await apiClient.put(`/orders/${orderId}`, payload);
    return data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
    const { data } = await apiClient.put(`/orders/${orderId}/status`, { status });
    return data;
};

// Assign order to a waiter
export const assignOrderToWaiter = async (orderId, payload) => {
    const { data } = await apiClient.put(`/orders/${orderId}/assign`, payload);
    return data;
};

// Delete order
export const deleteOrder = async (orderId) => {
    const { data } = await apiClient.delete(`/orders/${orderId}`);
    return data;
};

// Get orders queue (for kitchen)
export const fetchOrderQueue = async ({ status = 'preparing' } = {}) => {
    const { data } = await apiClient.get('/orders/queue', {
        params: { status },
    });
    return data;
};

// Add item to order
export const addOrderItem = async (orderId, itemPayload) => {
    const { data } = await apiClient.post(`/orders/${orderId}/items`, itemPayload);
    return data;
};

// Remove item from order
export const removeOrderItem = async (orderId, itemId) => {
    const { data } = await apiClient.delete(`/orders/${orderId}/items/${itemId}`);
    return data;
};

// Get order statistics
export const fetchOrderStats = async ({ startDate, endDate } = {}) => {
    const { data } = await apiClient.get('/orders/stats', {
        params: {
            ...(startDate && { startDate }),
            ...(endDate && { endDate }),
        },
    });
    return data;
};
