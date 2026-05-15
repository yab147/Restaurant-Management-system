/**
 * Common Utilities
 * Shared helper functions used across the application
 */

/**
 * Format currency values
 */
export function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
    }).format(amount || 0);
}

/**
 * Format date to human-readable string
 */
export function formatDate(date, format = 'short') {
    if (!date) return '';

    const d = new Date(date);

    if (format === 'short') {
        return d.toLocaleDateString('en-US');
    }

    if (format === 'long') {
        return d.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }

    if (format === 'time') {
        return d.toLocaleTimeString('en-US');
    }

    if (format === 'datetime') {
        return d.toLocaleString('en-US');
    }

    return d.toString();
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone) {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
}

/**
 * Validate email
 */
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate phone number
 */
export function isValidPhoneNumber(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
}

/**
 * Debounce function for search inputs
 */
export function debounce(func, delay = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

/**
 * Throttle function for scroll events
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
            }, limit);
        }
    };
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Get nested value from object by path
 */
export function getNestedValue(obj, path) {
    return path.split('.').reduce((current, prop) => current?.[prop], obj);
}

/**
 * Set nested value in object by path
 */
export function setNestedValue(obj, path, value) {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
            current[key] = {};
        }
        current = current[key];
    }

    current[keys[keys.length - 1]] = value;
    return obj;
}

/**
 * Merge objects recursively
 */
export function mergeObjects(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (typeof target === 'object' && typeof source === 'object') {
        for (const key in source) {
            if (typeof source[key] === 'object') {
                if (!target[key]) target[key] = {};
                mergeObjects(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    return mergeObjects(target, ...sources);
}

/**
 * Convert camelCase to Title Case
 */
export function camelCaseToTitleCase(str) {
    return str
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (c) => c.toUpperCase())
        .trim();
}

/**
 * Convert camelCase to kebab-case
 */
export function camelCaseToKebabCase(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generate random ID
 */
export function generateId(prefix = '') {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if value is empty
 */
export function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * Sort array by property
 */
export function sortBy(array, property, order = 'asc') {
    return [...array].sort((a, b) => {
        if (a[property] < b[property]) return order === 'asc' ? -1 : 1;
        if (a[property] > b[property]) return order === 'asc' ? 1 : -1;
        return 0;
    });
}

/**
 * Group array by property
 */
export function groupBy(array, property) {
    return array.reduce((acc, item) => {
        const key = item[property];
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});
}
