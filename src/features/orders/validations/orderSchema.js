/**
 * Orders Feature - Validation Schemas
 * Validation rules for forms using simple object-based validation
 */

export const createOrderSchema = {
    customerName: {
        required: true,
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Customer name must be 2-100 characters, letters and spaces only',
    },
    tableId: {
        required: false,
        message: 'Invalid table selected',
    },
    type: {
        required: true,
        enum: ['dine-in', 'takeout', 'delivery'],
        message: 'Order type must be dine-in, takeout, or delivery',
    },
    items: {
        required: true,
        minLength: 1,
        message: 'Order must contain at least one item',
    },
    notes: {
        required: false,
        maxLength: 500,
        message: 'Special instructions must be 500 characters or less',
    },
};

export const updateOrderSchema = {
    status: {
        required: false,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'],
        message: 'Invalid order status',
    },
    notes: {
        required: false,
        maxLength: 500,
        message: 'Special instructions must be 500 characters or less',
    },
};

export const orderItemSchema = {
    itemId: {
        required: true,
        message: 'Item must be selected',
    },
    quantity: {
        required: true,
        min: 1,
        max: 100,
        message: 'Quantity must be between 1 and 100',
    },
    specialInstructions: {
        required: false,
        maxLength: 300,
        message: 'Special instructions must be 300 characters or less',
    },
};

/**
 * Simple validation helper
 */
export function validateOrder(data, schema) {
    const errors = {};

    Object.entries(schema).forEach(([field, rules]) => {
        const value = data[field];

        if (rules.required && !value) {
            errors[field] = `${field} is required`;
            return;
        }

        if (!value) return; // Skip optional fields that are empty

        if (rules.minLength && value.length < rules.minLength) {
            errors[field] = rules.message || `Minimum length is ${rules.minLength}`;
        }

        if (rules.maxLength && value.length > rules.maxLength) {
            errors[field] = rules.message || `Maximum length is ${rules.maxLength}`;
        }

        if (rules.pattern && !rules.pattern.test(value)) {
            errors[field] = rules.message || 'Invalid format';
        }

        if (rules.enum && !rules.enum.includes(value)) {
            errors[field] = rules.message || 'Invalid selection';
        }

        if (rules.min !== undefined && value < rules.min) {
            errors[field] = rules.message || `Minimum value is ${rules.min}`;
        }

        if (rules.max !== undefined && value > rules.max) {
            errors[field] = rules.message || `Maximum value is ${rules.max}`;
        }
    });

    return {
        isValid: Object.keys(errors).length === 0,
        errors,
    };
}
