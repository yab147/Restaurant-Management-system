/**
 * Permission Provider
 * Manages user permissions and provides permission-checking utilities
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getPermissionsByRole, hasPermission, hasAnyPermission, hasAllPermissions } from '../permissions/guards.js';

const PermissionContext = createContext(null);

export function PermissionProvider({ children, user }) {
    const [permissions, setPermissions] = useState([]);

    // Update permissions when user or role changes
    useEffect(() => {
        if (user && user.role) {
            const userPerms = getPermissionsByRole(user.role);
            setPermissions(userPerms);
        } else {
            setPermissions([]);
        }
    }, [user?.role]);

    const contextValue = {
        permissions,
        user,
        hasPermission: (permission) => hasPermission(permissions, permission),
        hasAnyPermission: (requiredPerms) => hasAnyPermission(permissions, requiredPerms),
        hasAllPermissions: (requiredPerms) => hasAllPermissions(permissions, requiredPerms),
    };

    return (
        <PermissionContext.Provider value={contextValue}>
            {children}
        </PermissionContext.Provider>
    );
}

export function usePermission() {
    const context = useContext(PermissionContext);
    if (!context) {
        throw new Error('usePermission must be used within PermissionProvider');
    }
    return context;
}

// Component to guard content by permission
export function RequirePermission({ required = [], fallback = null, children, requireAll = false }) {
    const { hasAnyPermission, hasAllPermissions } = usePermission();

    if (!required || required.length === 0) {
        return children;
    }

    const hasAccess = requireAll
        ? hasAllPermissions(required)
        : hasAnyPermission(required);

    return hasAccess ? children : fallback;
}
