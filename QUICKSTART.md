# Quick Start Guide

## Prerequisites

- Node.js 18+ 
- npm 9+
- Backend API running at `http://localhost:3001/api`

## Installation

### 1. Install dependencies

```bash
npm install
```

This installs:
- React 18+
- React Router
- Vite (build tool)
- Tailwind CSS (styles)
- React Query (server state)
- Zustand (client state)
- Axios (HTTP)

### 2. Create environment file

```bash
cp .env.example .env
```

Update `.env` if your API runs on a different URL:

```env
VITE_API_URL=http://localhost:3001/api
VITE_DEBUG=true
```

### 3. Start development server

```bash
npm run dev
```

Server runs at `http://localhost:5173`

## Project Structure

```
src/
├── app/               # App-level config and routing
├── assets/           # Static files
├── components/       # Landing page components
├── context/          # Legacy context (being migrated)
├── features/         # Business domain modules
│   ├── orders/       # Orders feature (complete example)
│   ├── inventory/    # (To be created)
│   ├── menu/         # (To be created)
│   └── ...
├── lib/              # Utilities and helpers
├── modules/          # Legacy role-based modules (keep for now)
├── pages/            # Top-level pages
├── permissions/      # RBAC matrix and guards
├── providers/        # React context providers
├── services/         # Infrastructure services (API, storage)
├── shared/           # Shared components and utilities
├── types/            # Constants and types
└── utils/            # Legacy utilities
```

## Key Files

| File | Purpose |
|------|---------|
| `/src/providers/index.jsx` | Root provider composition |
| `/src/permissions/matrix.js` | RBAC matrix - single source of truth |
| `/src/services/api/axios.js` | HTTP client with auto token refresh |
| `/src/app/routes.js` | Route registry with permission guards |
| `/src/features/orders/` | Complete feature example |

## Common Tasks

### Build for production

```bash
npm run build
```

### Run tests

```bash
npm test
```

### Check for errors

```bash
npm run lint
```

### Format code

```bash
npm run format
```

## API Endpoints (Expected)

The backend should expose these endpoints for Orders feature:

```
GET    /api/orders                    # List orders
GET    /api/orders/:id                # Get order detail
POST   /api/orders                    # Create order
PUT    /api/orders/:id                # Update order
DELETE /api/orders/:id                # Delete order
PUT    /api/orders/:id/status         # Update status
POST   /api/orders/:id/items          # Add item
DELETE /api/orders/:id/items/:itemId  # Remove item
GET    /api/orders/stats              # Order statistics
GET    /api/orders/queue              # Kitchen queue

POST   /api/auth/login                # Login user
POST   /api/auth/refresh              # Refresh token
POST   /api/auth/logout               # Logout user
```

## Development Workflow

### 1. Create a new feature

```bash
# Create orders feature (already done)
mkdir -p src/features/inventory/{api,store,hooks,types,validations,routes,pages,components}

# Copy from orders example and customize
cp -r src/features/orders/* src/features/inventory/
```

### 2. Implement API layer

Edit `/src/features/inventory/api/index.js`:

```jsx
import apiClient from '../../../services/api/axios.js';

export const fetchInventory = async (filters) => {
  const { data } = await apiClient.get('/inventory', { params: filters });
  return data;
};
```

### 3. Implement hooks

Edit `/src/features/inventory/hooks/useInventory.js`:

```jsx
import { useQuery } from '@tanstack/react-query';
import * as api from '../api/index.js';

export function useInventory(filters) {
  return useQuery(['inventory', filters], () => api.fetchInventory(filters));
}
```

### 4. Create store

Edit `/src/features/inventory/store/useInventoryStore.js`:

```jsx
import { create } from 'zustand';

export const useInventoryStore = create((set) => ({
  filters: { category: 'all' },
  setFilters: (f) => set((s) => ({ 
    filters: { ...s.filters, ...f } 
  })),
}));
```

### 5. Create routes

Edit `/src/features/inventory/routes/index.js`:

```jsx
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

### 6. Register routes

In `/src/app/routes.js`:

```jsx
import inventoryRoutes from '../features/inventory/routes/index.js';

export const featureRoutes = [
  ...ordersRoutes,
  ...inventoryRoutes,
];
```

### 7. Create page component

Create `/src/features/inventory/pages/InventoryListPage.jsx`:

```jsx
import { useInventory } from '../hooks/useInventory.js';
import { useInventoryStore } from '../store/useInventoryStore.js';
import { usePermission } from '../../../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../../../permissions/matrix.js';

export default function InventoryListPage() {
  const { filters, setFilters } = useInventoryStore();
  const { hasPermission } = usePermission();
  const { data, isLoading } = useInventory(filters);

  if (!hasPermission(PERMISSIONS.INVENTORY_VIEW)) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Inventory</h1>
      {/* Implement UI */}
    </div>
  );
}
```

## Testing Permissions

### Add test permission to matrix

In `/src/permissions/matrix.js`:

```jsx
export const PERMISSIONS = {
  // ... existing
  TEST_PERMISSION: 'test:permission',
};

export const ROLE_PERMISSIONS = {
  admin: [/* all permissions */],
  manager: [/* existing */, PERMISSIONS.TEST_PERMISSION],
  // ... others unchanged
};
```

### Test in component

```jsx
import { usePermission } from '../providers/PermissionProvider.jsx';
import { PERMISSIONS } from '../permissions/matrix.js';

function TestComponent() {
  const { hasPermission } = usePermission();
  
  return (
    <div>
      {hasPermission(PERMISSIONS.TEST_PERMISSION) ? (
        <p>✓ Permission granted</p>
      ) : (
        <p>✗ Permission denied</p>
      )}
    </div>
  );
}
```

## Debugging

### Enable debug mode

In `.env`:

```env
VITE_DEBUG=true
```

In code:

```jsx
import config from '../app/config/index.js';

if (config.debug) {
  console.log('Debug mode enabled');
}
```

### Check Redux DevTools (for Zustand)

Zustand works with Redux DevTools. Install browser extension:
- https://github.com/reduxjs/redux-devtools

### Check React Query DevTools

React Query has built-in devtools:

```jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// In your root component
<QueryProvider>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryProvider>
```

### Check Network tab

1. Open DevTools (F12)
2. Go to Network tab
3. Make API calls
4. Check request/response headers and body
5. Verify `Authorization: Bearer {token}` is present

## Common Issues

### Build fails with "module not found"

```bash
npm install zustand @tanstack/react-query
```

### API calls return 401 Unauthorized

- Check token in localStorage (DevTools > Application > Local Storage)
- Verify `authStorage.js` is reading/writing correctly
- Check API server is running

### Permissions not working

- Verify user has correct `role` in auth context
- Check permission matrix has role mapped to permission
- Use `usePermission()` hook, not direct import

### Components not lazy loading

- Ensure route uses `lazy(() => import(...))`
- Wrap route in `<Suspense>` with fallback

## Performance Monitoring

### React DevTools Profiler

1. Open DevTools
2. Go to Profiler tab
3. Record interactions
4. Analyze component render times

### Network waterfall

1. Open DevTools > Network
2. Check that requests don't overlap unnecessarily
3. Look for slow API responses

### Bundle size

```bash
npm run build
npm install -g serve
serve -s dist
```

Check `/dist/assets/*.js` file sizes

## Deployment

### Build

```bash
npm run build
```

Creates optimized bundle in `/dist/` folder

### Deploy to production

Options:
- **Vercel**: `npm install -g vercel && vercel`
- **Netlify**: Push to git, auto-deploy
- **Docker**: Create Dockerfile, build image
- **Static host**: Upload `/dist/` contents

### Environment for production

`.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com
VITE_DEBUG=false
```

---

**Next**: See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed architecture guide.
