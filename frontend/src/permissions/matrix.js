/**
 * Permission Matrix
 * Defines all permissions in the system and role-to-permission mappings
 * Canonical source of truth for RBAC
 */

// All permissions in the system
export const PERMISSIONS = {
    // Orders
    ORDERS_VIEW: 'orders:view',
    ORDERS_CREATE: 'orders:create',
    ORDERS_EDIT: 'orders:edit',
    ORDERS_DELETE: 'orders:delete',
    ORDERS_PROCESS_PAYMENT: 'orders:process_payment',
    ORDERS_QUEUE_MANAGE: 'orders:queue_manage',

    // Inventory
    INVENTORY_VIEW: 'inventory:view',
    INVENTORY_EDIT: 'inventory:edit',
    INVENTORY_DELETE: 'inventory:delete',
    INVENTORY_RESTOCK: 'inventory:restock',

    // Menu
    MENU_VIEW: 'menu:view',
    MENU_CREATE: 'menu:create',
    MENU_EDIT: 'menu:edit',
    MENU_DELETE: 'menu:delete',

    // Payments
    PAYMENTS_VIEW: 'payments:view',
    PAYMENTS_PROCESS: 'payments:process',
    PAYMENTS_REFUND: 'payments:refund',
    PAYMENTS_REPORTS: 'payments:reports',

    // Reservations
    RESERVATIONS_VIEW: 'reservations:view',
    RESERVATIONS_CREATE: 'reservations:create',
    RESERVATIONS_EDIT: 'reservations:edit',
    RESERVATIONS_CANCEL: 'reservations:cancel',

    // Tables
    TABLES_VIEW: 'tables:view',
    TABLES_MANAGE: 'tables:manage',
    TABLES_STATUS: 'tables:status',

    // Reports
    REPORTS_VIEW: 'reports:view',
    REPORTS_EXPORT: 'reports:export',
    REPORTS_ANALYTICS: 'reports:analytics',

    // Users & Settings
    USERS_VIEW: 'users:view',
    USERS_MANAGE: 'users:manage',
    SETTINGS_VIEW: 'settings:view',
    SETTINGS_EDIT: 'settings:edit',

    // Dashboard
    DASHBOARD_VIEW: 'dashboard:view',
};

// Role-to-Permission mappings
export const ROLE_PERMISSIONS = {
    admin: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.USERS_VIEW,
        PERMISSIONS.USERS_MANAGE,
        PERMISSIONS.SETTINGS_VIEW,
        PERMISSIONS.SETTINGS_EDIT,
    ],

    manager: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.ORDERS_VIEW,
        PERMISSIONS.ORDERS_CREATE,
        // PERMISSIONS.ORDERS_EDIT,
        // PERMISSIONS.ORDERS_DELETE,
        PERMISSIONS.ORDERS_PROCESS_PAYMENT,
        PERMISSIONS.ORDERS_QUEUE_MANAGE,
        PERMISSIONS.INVENTORY_VIEW,
        // PERMISSIONS.INVENTORY_EDIT,
        // PERMISSIONS.INVENTORY_DELETE,
        PERMISSIONS.INVENTORY_RESTOCK,
        PERMISSIONS.MENU_VIEW,
        // PERMISSIONS.MENU_CREATE,
        // PERMISSIONS.MENU_EDIT,
        // PERMISSIONS.MENU_DELETE,
        PERMISSIONS.PAYMENTS_VIEW,
        PERMISSIONS.PAYMENTS_PROCESS,
        PERMISSIONS.PAYMENTS_REFUND,
        PERMISSIONS.PAYMENTS_REPORTS,
        PERMISSIONS.RESERVATIONS_VIEW,
        // PERMISSIONS.RESERVATIONS_EDIT,
        // PERMISSIONS.RESERVATIONS_CANCEL,
        PERMISSIONS.TABLES_VIEW,
        PERMISSIONS.TABLES_MANAGE,
        PERMISSIONS.REPORTS_VIEW,
        PERMISSIONS.REPORTS_EXPORT,
        PERMISSIONS.REPORTS_ANALYTICS,
        PERMISSIONS.USERS_VIEW,
         PERMISSIONS.USERS_MANAGE,
        PERMISSIONS.SETTINGS_VIEW,
    ],

    cashier: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.ORDERS_VIEW,
        PERMISSIONS.ORDERS_CREATE,
        PERMISSIONS.ORDERS_PROCESS_PAYMENT,
        PERMISSIONS.PAYMENTS_VIEW,
        PERMISSIONS.PAYMENTS_PROCESS,
        PERMISSIONS.MENU_VIEW,
        PERMISSIONS.RESERVATIONS_VIEW,
        PERMISSIONS.RESERVATIONS_CREATE,
        PERMISSIONS.TABLES_VIEW,
        PERMISSIONS.SETTINGS_VIEW,
    ],

    waiter: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.ORDERS_VIEW,
        PERMISSIONS.ORDERS_CREATE,
        PERMISSIONS.ORDERS_EDIT,
        PERMISSIONS.MENU_VIEW,
        PERMISSIONS.RESERVATIONS_VIEW,
        PERMISSIONS.RESERVATIONS_EDIT,
        PERMISSIONS.TABLES_VIEW,
        PERMISSIONS.TABLES_STATUS,
        PERMISSIONS.SETTINGS_VIEW,
    ],

    chef: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.ORDERS_VIEW,
        PERMISSIONS.ORDERS_QUEUE_MANAGE,
        PERMISSIONS.INVENTORY_VIEW,
        PERMISSIONS.MENU_VIEW,
        PERMISSIONS.SETTINGS_VIEW,
    ],

    customer: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.MENU_VIEW,
        PERMISSIONS.ORDERS_VIEW,
        PERMISSIONS.RESERVATIONS_VIEW,
    ],
};

// Get permissions for a role
export const getPermissionsForRole = (role) => {
    return ROLE_PERMISSIONS[role] || [];
};

// Check if a role has permission
export const roleHasPermission = (role, permission) => {
    const permissions = getPermissionsForRole(role);
    return permissions.includes(permission);
};

// Check if a role has any of the given permissions
export const roleHasAnyPermission = (role, permissions) => {
    return permissions.some(p => roleHasPermission(role, p));
};

// Check if a role has all of the given permissions
export const roleHasAllPermissions = (role, permissions) => {
    return permissions.every(p => roleHasPermission(role, p));
};
