/**
 * Orders Feature - Zustand Store
 * Client-side feature state management (not server state)
 * Manages: UI filters, selected items, temporary form data, queues
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useOrderStore = create(
    immer((set) => ({
        // Order Queue (for kitchen staff)
        queue: [],
        addToQueue: (order) =>
            set((state) => {
                state.queue.push(order);
            }),
        removeFromQueue: (orderId) =>
            set((state) => {
                state.queue = state.queue.filter((o) => o.orderId !== orderId);
            }),
        updateQueueItem: (orderId, updates) =>
            set((state) => {
                const idx = state.queue.findIndex((o) => o.orderId === orderId);
                if (idx !== -1) {
                    state.queue[idx] = { ...state.queue[idx], ...updates };
                }
            }),
        clearQueue: () => set({ queue: [] }),

        // Filters (UI state)
        filters: {
            status: 'all',
            tableId: null,
            search: '',
            page: 1,
            size: 25,
        },
        setFilters: (filters) =>
            set((state) => {
                state.filters = { ...state.filters, ...filters };
            }),
        resetFilters: () =>
            set({
                filters: {
                    status: 'all',
                    tableId: null,
                    search: '',
                    page: 1,
                    size: 25,
                },
            }),

        // Selected order for detail view
        selectedOrderId: null,
        setSelectedOrderId: (orderId) =>
            set({ selectedOrderId: orderId }),

        // Temporary form data for new order creation
        formData: {
            customerName: '',
            tableId: null,
            type: 'dine-in',
            items: [],
            notes: '',
        },
        setFormData: (data) =>
            set((state) => {
                state.formData = { ...state.formData, ...data };
            }),
        addFormItem: (item) =>
            set((state) => {
                const existing = state.formData.items.find((i) => i.itemId === item.itemId);
                if (existing) {
                    existing.quantity += item.quantity || 1;
                } else {
                    state.formData.items.push(item);
                }
            }),
        removeFormItem: (itemId) =>
            set((state) => {
                state.formData.items = state.formData.items.filter((i) => i.itemId !== itemId);
            }),
        clearFormData: () =>
            set({
                formData: {
                    customerName: '',
                    tableId: null,
                    type: 'dine-in',
                    items: [],
                    notes: '',
                },
            }),

        // UI state
        isCreatingOrder: false,
        setIsCreatingOrder: (value) => set({ isCreatingOrder: value }),
    }))
);
