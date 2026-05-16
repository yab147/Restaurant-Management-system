/**
 * Permission Guards & Utilities
 * Helpers for checking permissions in components and routes
 */

import { ROLE_PERMISSIONS } from './matrix.js';

/**
 * Check if user has specific permission
 */
export const hasPermission = (userPermissions, requiredPermission) => {
    if (!requiredPermission) return true;
    if (!userPermissions) return false;
    return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has any of the required permissions
 */
export const hasAnyPermission = (userPermissions, requiredPermissions) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!userPermissions) return false;
    return requiredPermissions.some(p => userPermissions.includes(p));
};

/**
 * Check if user has all of the required permissions
 */
export const hasAllPermissions = (userPermissions, requiredPermissions) => {
    if (!requiredPermissions || requiredPermissions.length === 0) return true;
    if (!userPermissions) return false;
    return requiredPermissions.every(p => userPermissions.includes(p));
};

/**
 * Get user permissions by role
 */
export const getPermissionsByRole = (role) => {
    return ROLE_PERMISSIONS[role] || [];
};

/**
 * Generate sidebar menu from routes based on permissions
 */
export const filterMenuByPermissions = (menuItems, userPermissions) => {
    return menuItems
        .filter(item => {
            // If no permissions required, show it
            if (!item.permissions || item.permissions.length === 0) return true;
            // Show only if user has permission
            return hasAnyPermission(userPermissions, item.permissions);
        })
        .map(item => ({
            ...item,
            children: item.children
                ? filterMenuByPermissions(item.children, userPermissions)
                : undefined,
        }))
        .filter(item => {
            // Remove items with no children and no permissions
            if (item.children && item.children.length === 0 && item.permissions && item.permissions.length > 0) {
                return false;
            }
            return true;
        });
};
