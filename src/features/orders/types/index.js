/**
 * Orders Feature - Types and Constants
 */

// Order Status Types
export const ORDER_STATUSES = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    PREPARING: 'preparing',
    READY: 'ready',
    SERVED: 'served',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

export const ORDER_STATUS_LABELS = {
    [ORDER_STATUSES.PENDING]: 'Pending',
    [ORDER_STATUSES.CONFIRMED]: 'Confirmed',
    [ORDER_STATUSES.PREPARING]: 'Preparing',
    [ORDER_STATUSES.READY]: 'Ready',
    [ORDER_STATUSES.SERVED]: 'Served',
    [ORDER_STATUSES.COMPLETED]: 'Completed',
    [ORDER_STATUSES.CANCELLED]: 'Cancelled',
};

// Order Type
export const ORDER_TYPES = {
    DINE_IN: 'dine-in',
    TAKEOUT: 'takeout',
    DELIVERY: 'delivery',
};

export const ORDER_TYPE_LABELS = {
    [ORDER_TYPES.DINE_IN]: 'Dine In',
    [ORDER_TYPES.TAKEOUT]: 'Takeout',
    [ORDER_TYPES.DELIVERY]: 'Delivery',
};

// Payment Status
export const PAYMENT_STATUSES = {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
};

export const PAYMENT_STATUS_LABELS = {
    [PAYMENT_STATUSES.PENDING]: 'Pending',
    [PAYMENT_STATUSES.COMPLETED]: 'Completed',
    [PAYMENT_STATUSES.FAILED]: 'Failed',
};

// Status colors for UI
export const STATUS_COLORS = {
    [ORDER_STATUSES.PENDING]: 'yellow',
    [ORDER_STATUSES.CONFIRMED]: 'blue',
    [ORDER_STATUSES.PREPARING]: 'purple',
    [ORDER_STATUSES.READY]: 'green',
    [ORDER_STATUSES.SERVED]: 'green',
    [ORDER_STATUSES.COMPLETED]: 'gray',
    [ORDER_STATUSES.CANCELLED]: 'red',
};

// Order validation rules
export const ORDER_VALIDATION_RULES = {
    MIN_ITEMS: 1,
    MAX_ITEMS: 100,
    MIN_SPECIAL_INSTRUCTIONS: 0,
    MAX_SPECIAL_INSTRUCTIONS: 500,
};
