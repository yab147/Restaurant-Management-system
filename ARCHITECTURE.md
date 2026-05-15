# Enterprise Restaurant Management System - Architecture Guide

## Overview

This is a production-grade restaurant ERP system built with React, Vite, and a domain-driven architecture. The system uses role-based access control (RBAC), centralized state management, and best practices for scalable frontend development.

## Architecture Layers

### 1. **Providers Layer** (`/src/providers/`)

Manages application context and global state.

- **QueryProvider** - React Query client with optimal defaults for server state
- **AuthProvider** - Authentication state and user session management
- **PermissionProvider** - Role-based permission checking and guards
- **RootProviders** - Composes all providers in correct order

Wrap your app with providers in this order:
```jsx
<QueryProvider>
  <AuthProvider>
    <PermissionProvider user={user}>
      <App />
    </PermissionProvider>
  </AuthProvider>
</QueryProvider>
```

### 2. **Services Layer** (`/src/services/`)

Low-level infrastructure services.

- **api/axios.js** - HTTP client with automatic token injection and refresh
- **storage/index.js** - Persistent auth state (tokens, user data)
- **realtime/** (future) - WebSocket for real-time updates

Services are utilities - never import them directly in components. Wrap them in API functions or hooks.

### 3. **Permissions Layer** (`/src/permissions/`)

Centralized RBAC implementation.

- **matrix.js** - Single source of truth: all permissions and role→permission mappings
- **guards.js** - Reusable permission checking utilities

### 4. **Features Layer** (`/src/features/`)

Business domain-driven modules. Each feature is self-contained.

Structure for each feature (e.g., `/features/orders/`):

```
orders/
├── api/
│   └── index.js                # API calls (fetchOrders, createOrder, etc.)
├── store/
│   └── useOrderStore.js        # Zustand - UI state (filters, selected items)
├── hooks/
│   └── useOrders.js            # React Query - Server state
├── types/
│   └── index.js                # Constants (ORDER_STATUSES, STATUS_COLORS)
├── validations/
│   └── orderSchema.js          # Form validation rules
├── routes/
│   └── index.js                # Route definitions with permissions
├── pages/
│   ├── OrderListPage.jsx       # List view
│   └── OrderDetailPage.jsx     # Detail/edit view
├── components/
│   ├── OrderTable.jsx          # Reusable components
│   └── OrderFilter.jsx
├── services/
│   └── index.js                # Feature-specific formatters
└── utils/
    └── index.js                # Feature utilities
```

### 5. **App Layer** (`/src/app/`)

Application-wide configuration and routing.

- **routes.js** - Route registry with permission guards
- **config/index.js** - Environment-aware configuration

## State Management Strategy

### Server State (React Query)

Data from API server. Use React Query hooks:

```jsx
// In /features/orders/hooks/useOrders.js
import { useQuery, useMutation } from '@tanstack/react-query';

export function useOrders(filters) {
  return useQuery(
    ['orders', filters],
    () => fetchOrders(filters),
    {
      staleTime: 30_000,      // Data fresh for 30 seconds
      keepPreviousData: true, // Don't lose data while fetching
    }
  );
}

export function useCreateOrder() {
  const qc = useQueryClient();
  
  return useMutation(createOrder, {
    onMutate: (newOrder) => {
      // Optimistic update
      qc.setQueryData(['orders'], (old) => ({
        ...old,
        data: [newOrder, ...old.data],
      }));
    },
    onSettled: () => {
      // Refetch fresh data after mutation
      qc.invalidateQueries(['orders']);
    },
  });
}
```

### UI State (Zustand)

Local UI state. Use Zustand store:

```jsx
// In /features/orders/store/useOrderStore.js
import { create } from 'zustand';

export const useOrderStore = create((set) => ({
  // Filters
  filters: { status: 'all', page: 1, search: '' },
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),

  // Selected item
  selectedOrderId: null,
  setSelectedOrderId: (id) => set({ selectedOrderId: id }),

  // Form draft
  formData: { customerName: '', items: [] },
  setFormData: (data) => set({ formData: data }),
}));
```

### Permissions State (Context)

User roles and permissions. Use PermissionProvider:

```jsx
// In component
import { usePermission } from '../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../permissions/matrix.js';

function OrderList() {
  const { hasPermission, user } = usePermission();

  return (
    <>
      {hasPermission(PERMISSIONS.ORDERS_CREATE) && (
        <button>New Order</button>
      )}
    </>
  );
}
```

## Permission System

### Adding a New Permission

1. Add to `PERMISSIONS` object in `/src/permissions/matrix.js`:

```js
export const PERMISSIONS = {
  // ... existing
  ORDERS_EXPORT: 'orders:export',
};
```

2. Add to role mappings in `/src/permissions/matrix.js`:

```js
export const ROLE_PERMISSIONS = {
  admin: [/* all permissions */, PERMISSIONS.ORDERS_EXPORT],
  manager: [/* 22 permissions */, PERMISSIONS.ORDERS_EXPORT],
  cashier: [/* 8 permissions */, PERMISSIONS.ORDERS_EXPORT],
  // ... others unchanged
};
```

3. Use in components:

```jsx
if (hasPermission(PERMISSIONS.ORDERS_EXPORT)) {
  // Show export button
}
```

### Permission Matrix Structure

- **6 roles**: admin, manager, cashier, waiter, chef, customer
- **31 permissions**: Granular permission bits for each business domain
- **Hierarchical**: Admin ⊃ Manager ⊃ Cashier
- **CRUD-based**: Most domains have create, read, edit, delete perms

## Creating a New Feature

### 1. Create directory structure

```bash
mkdir -p src/features/inventory/{api,store,hooks,types,validations,routes,pages,components,services,utils}
```

### 2. Create API layer (`api/index.js`)

```jsx
// Centralize all backend calls for the feature
import apiClient from '../../../services/api/axios.js';

export const fetchInventory = async (filters) => {
  const { data } = await apiClient.get('/inventory', { params: filters });
  return data;
};

export const createInventoryItem = async (payload) => {
  const { data } = await apiClient.post('/inventory', payload);
  return data;
};
```

### 3. Create React Query hooks (`hooks/useInventory.js`)

```jsx
// Manage server state with caching and synchronization
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../api/index.js';

export function useInventory(filters) {
  return useQuery(['inventory', filters], () => api.fetchInventory(filters));
}

export function useCreateInventoryItem() {
  const qc = useQueryClient();
  return useMutation(api.createInventoryItem, {
    onSettled: () => qc.invalidateQueries(['inventory']),
  });
}
```

### 4. Create Zustand store (`store/useInventoryStore.js`)

```jsx
// Manage UI state (filters, selected items, form drafts)
import { create } from 'zustand';

export const useInventoryStore = create((set) => ({
  filters: { category: 'all', page: 1 },
  setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  
  selectedItemId: null,
  setSelectedItemId: (id) => set({ selectedItemId: id }),
}));
```

### 5. Create types and constants (`types/index.js`)

```jsx
export const INVENTORY_STATUSES = {
  IN_STOCK: 'in_stock',
  LOW: 'low',
  OUT_OF_STOCK: 'out_of_stock',
};

export const STATUS_LABELS = {
  in_stock: 'In Stock',
  low: 'Low Stock',
  out_of_stock: 'Out of Stock',
};
```

### 6. Create validation schemas (`validations/inventorySchema.js`)

```jsx
export const createInventorySchema = {
  itemName: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  quantity: {
    required: true,
    min: 0,
  },
};
```

### 7. Create routes (`routes/index.js`)

```jsx
// Define routes with permission requirements and metadata
import { lazy } from 'react';
import { PERMISSIONS } from '../../../permissions/matrix.js';

const InventoryListPage = lazy(() => import('../pages/InventoryListPage.jsx'));

export const inventoryRoutes = [
  {
    path: '/inventory',
    element: <InventoryListPage />,
    permissions: [PERMISSIONS.INVENTORY_VIEW],
    meta: {
      id: 'inventory',
      title: 'Inventory',
      icon: 'Package',
      group: 'Operations',
    },
  },
];
```

### 8. Create pages (`pages/InventoryListPage.jsx`)

```jsx
// Use hooks to fetch data, Zustand for filters, permissions for visibility
import { useInventory } from '../hooks/useInventory.js';
import { useInventoryStore } from '../store/useInventoryStore.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../../../permissions/matrix.js';

export default function InventoryListPage() {
  const { filters, setFilters } = useInventoryStore();
  const { hasPermission } = usePermission();
  const { data, isLoading } = useInventory(filters);

  if (!hasPermission(PERMISSIONS.INVENTORY_VIEW)) {
    return <AccessDenied />;
  }

  return (
    <div>
      {/* Implement list view */}
    </div>
  );
}
```

### 9. Register routes in app

In `/src/app/routes.js`, add:

```jsx
import inventoryRoutes from '../features/inventory/routes/index.js';

export const featureRoutes = [
  ...ordersRoutes,
  ...inventoryRoutes,
];
```

## API Client Usage

The axios instance auto-injects auth token and handles token refresh:

```jsx
// Manual API call (usually wrapped in a hook or API function)
import apiClient from '../services/api/axios.js';

const fetchOrders = async () => {
  try {
    const { data } = await apiClient.get('/orders');
    return data;
  } catch (error) {
    console.error('Failed to fetch orders:', error.message);
  }
};

// Automatic behaviors:
// - Adds Authorization header with access token
// - On 401: Refreshes token and retries request
// - On refresh failure: Clears auth and redirects to /login
```

## Database Integration

### User Roles Table

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin', 'manager', 'cashier', 'waiter', 'chef', 'customer'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Orders Table

```sql
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(100),
  type ENUM('dine-in', 'takeout', 'delivery'),
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'),
  total DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### API Response Format

All endpoints should return:

```json
{
  "success": true,
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

On error:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "status": 400
}
```

## Best Practices

### 1. Keep components small

- One responsibility per component
- Prefer composition over large components
- Use custom hooks to extract logic

### 2. Use TypeScript-like discipline without TypeScript

```jsx
/**
 * OrderList Component
 * 
 * @param {Object} props
 * @param {Object[]} props.orders - List of order objects
 * @param {Function} props.onSelectOrder - Callback when order is selected
 * @param {boolean} props.isLoading - Loading state
 * @returns {JSX.Element}
 */
export function OrderList({ orders = [], onSelectOrder, isLoading }) {
  // Implementation
}
```

### 3. Optimize re-renders

```jsx
// Use useCallback for handlers passed to memoized components
const handleCreate = useCallback((data) => {
  createOrder(data);
}, [createOrder]);

// Use useMemo for expensive computations
const filteredOrders = useMemo(() => {
  return orders.filter(o => o.status === filter);
}, [orders, filter]);
```

### 4. Handle loading and error states

```jsx
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorBoundary error={error} />;
if (!data) return <EmptyState />;

return <List data={data} />;
```

### 5. Test permissions first

```jsx
import { usePermission } from '../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../permissions/matrix.js';

export default function AdminPanel() {
  const { hasPermission } = usePermission();

  if (!hasPermission(PERMISSIONS.USERS_MANAGE)) {
    return <Unauthorized />;
  }

  // Render admin content
}
```

## Environment Variables

Create `.env` file in project root (copy from `.env.example`):

```env
VITE_API_URL=http://localhost:3001/api
VITE_AUTH_TOKEN_KEY=auth_token
VITE_ENABLE_NOTIFICATIONS=true
```

Access in code:

```jsx
import config from '../app/config/index.js';

console.log(config.api.baseURL);
console.log(config.features.enableNotifications);
```

## Troubleshooting

### Issue: Token not being sent in requests

**Solution**: Ensure `AuthProvider` wraps your app and user is authenticated:

```jsx
import { useAuth } from '../providers/AuthProvider.jsx';

// In component
const { user } = useAuth();
console.log('User logged in:', !!user);
```

### Issue: Permission checks always fail

**Solution**: Verify `PermissionProvider` gets user prop and it has `role`:

```jsx
// In PermissionProvider parent
<PermissionProvider user={currentUser}>
  {children}
</PermissionProvider>

// currentUser should have: { id, email, role, ... }
```

### Issue: Data not refetching after mutation

**Solution**: Ensure mutation calls `qc.invalidateQueries()`:

```jsx
onSettled: () => {
  qc.invalidateQueries(['orders']); // Marks cache as stale
}
```

## Performance Tips

1. **Lazy load routes**: Already done in `routes.js` with `lazy()`
2. **Code splitting**: Vite automatically chunks features
3. **Memoize expensive computations**: Use `useMemo` and `useCallback`
4. **Optimize queries**: Set appropriate `staleTime` and `gcTime`
5. **Paginate large lists**: Use cursor-based or offset pagination

## Next Steps

1. Install dependencies: `npm install zustand @tanstack/react-query`
2. Set up backend API endpoints (orders, inventory, menu, etc.)
3. Create remaining features following the template
4. Add shared UI components (Modal, Form, Table)
5. Implement authentication flows
6. Set up error tracking (Sentry)
7. Add analytics (Mixpanel, Posthog)

---

**Questions?** See `/src/features/README.md` for feature template and examples.
