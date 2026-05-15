# Restaurant Management System - Enterprise ERP

A production-grade restaurant management ERP system built with React 19, Vite, and modern web development best practices.

## Features

### 🔐 Role-Based Access Control (RBAC)
- 6 built-in roles: Admin, Manager, Cashier, Waiter, Chef, Customer
- 31+ granular permissions
- Permission-based routing and UI rendering
- Centralized permission matrix

### 📊 Business Domains
- **Orders** - Complete order management with kitchen queue
- **Inventory** - Stock management (to be built)
- **Menu** - Menu item management (to be built)
- **Payments** - Payment processing (to be built)
- **Reservations** - Table reservations (to be built)
- **Reports** - Analytics and reporting (to be built)
- **Tables** - Seating management (to be built)
- **Users** - User management (to be built)

### 🚀 Modern Tech Stack
- **React 19** - Latest UI library
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **React Query** - Server state management with caching
- **Zustand** - Lightweight client state management
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client with interceptors
- **Express.js** - Backend server
- **MySQL** - Database

### 🏗️ Architecture
- **Domain-Driven Design** - Features organized by business domain
- **Feature-Based Structure** - Each feature is self-contained
- **Permission-Based Guards** - Routes and UI guarded by permissions
- **Service Layer** - API, storage, and infrastructure services
- **Provider Pattern** - Composable context providers
- **Type-Safe JavaScript** - Well-documented code with JSDoc

## Quick Links

- 📖 **[Quick Start Guide](./QUICKSTART.md)** - Get running in 5 minutes
- 🏗️ **[Architecture Guide](./ARCHITECTURE.md)** - Deep dive into design
- 📁 **[Feature Template](./src/features/README.md)** - Create new features
- 🔐 **[RBAC Matrix](./src/permissions/matrix.js)** - Permission definitions

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Create environment file

```bash
cp .env.example .env
```

### 3. Start development server

```bash
npm run dev
```

Navigate to `http://localhost:5173`

### 4. Start backend API

```bash
npm run server
```

API runs at `http://localhost:3001`

## Project Structure

```
.
├── src/
│   ├── app/                    # App config and routing
│   ├── assets/                 # Static assets
│   ├── components/             # Landing page components
│   ├── features/               # Business domain features
│   │   ├── orders/             # Complete example
│   │   ├── inventory/          # (To build)
│   │   ├── menu/               # (To build)
│   │   └── ...
│   ├── hooks/                  # App-wide custom hooks
│   ├── lib/                    # Utilities
│   ├── modules/                # Legacy role-based modules
│   ├── pages/                  # Top-level pages
│   ├── permissions/            # RBAC implementation
│   ├── providers/              # React context providers
│   ├── services/               # Infrastructure services
│   ├── shared/                 # Shared components
│   └── types/                  # Constants
├── public/                     # Static files
├── server.js                   # Express backend
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── ARCHITECTURE.md             # Detailed architecture guide
└── QUICKSTART.md               # Quick start guide
```

## Core Concepts

### Features

Self-contained business domain modules:

```
features/orders/
├── api/                # API calls
├── store/              # UI state (Zustand)
├── hooks/              # Server state (React Query)
├── types/              # Constants and types
├── validations/        # Form validation rules
├── routes/             # Route definitions
├── pages/              # Page components
├── components/         # Reusable components
├── services/           # Formatters and utilities
└── utils/              # Feature utilities
```

### Permissions

Role-based access control with permission matrix:

```jsx
// In /src/permissions/matrix.js
export const PERMISSIONS = {
  ORDERS_VIEW: 'orders:view',
  ORDERS_CREATE: 'orders:create',
  ORDERS_EDIT: 'orders:edit',
  ORDERS_DELETE: 'orders:delete',
  // ... 27 more permissions
};

export const ROLE_PERMISSIONS = {
  admin: [/* all 31 permissions */],
  manager: [/* 22 permissions */],
  cashier: [/* 8 permissions */],
  waiter: [/* 9 permissions */],
  chef: [/* 5 permissions */],
  customer: [/* 5 permissions */],
};
```

### State Management

**Server State** (React Query):
```jsx
const { data, isLoading } = useOrders(filters);
const { mutate: createOrder } = useCreateOrder();
```

**Client State** (Zustand):
```jsx
const { filters, setFilters } = useOrderStore();
```

**Permissions State** (Context):
```jsx
const { hasPermission, user } = usePermission();
```

## API Integration

### Automatic Token Management

The axios client automatically:
- Injects `Authorization: Bearer {token}` header
- Refreshes expired tokens
- Retries failed requests
- Redirects to login on auth failure

### Error Handling

All API errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "status": 400
}
```

## Database

### Schema

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'manager', 'cashier', 'waiter', 'chef', 'customer') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
  id INT PRIMARY KEY AUTO_INCREMENT,
  customer_name VARCHAR(100),
  type ENUM('dine-in', 'takeout', 'delivery') NOT NULL,
  status ENUM('pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled') NOT NULL,
  total DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Development

### Create New Feature

1. Create directory structure
2. Implement API layer
3. Create React Query hooks
4. Create Zustand store
5. Define constants and validation
6. Create routes with permissions
7. Build page components
8. Register in app routes

See [ARCHITECTURE.md](./ARCHITECTURE.md#creating-a-new-feature) for detailed steps.

### Add Permission

1. Add to `PERMISSIONS` object
2. Map to role(s) in `ROLE_PERMISSIONS`
3. Use in components with `usePermission()`

See [ARCHITECTURE.md](./ARCHITECTURE.md#permission-system) for details.

### Build & Deploy

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview build
npm run preview

# Deploy (example: Vercel)
vercel deploy
```

## Performance

- ✅ Code splitting via Vite
- ✅ Lazy loading routes
- ✅ React Query caching
- ✅ Optimistic updates
- ✅ Tailwind CSS purging

## Testing

```bash
npm test              # Run tests
npm run test:watch   # Watch mode
npm run test:coverage # Coverage report
```

## Contributing

1. Create feature branch
2. Follow existing patterns in `/src/features/orders/`
3. Write JSDoc comments
4. Test permissions and API integration
5. Submit PR with description

## Troubleshooting

### Issue: Cannot find module 'zustand'

**Solution:**
```bash
npm install zustand @tanstack/react-query
```

### Issue: API calls return 401

**Solution:**
- Check backend is running (`npm run server`)
- Verify token in localStorage
- Check API URL in `.env`

### Issue: Permission denied everywhere

**Solution:**
- Verify user has correct `role` in database
- Check permission matrix has role mapped
- Use `usePermission()` hook

### Issue: Build fails

**Solution:**
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Documentation

- **[Quick Start](./QUICKSTART.md)** - 5-minute setup guide
- **[Architecture](./ARCHITECTURE.md)** - Comprehensive design guide
- **[Feature Template](./src/features/README.md)** - How to build features
- **[Permissions](./src/permissions/matrix.js)** - Permission definitions

## License

Private - Restaurant Management System

## Support

For issues or questions, check:
1. [Quick Start Guide](./QUICKSTART.md)
2. [Architecture Guide](./ARCHITECTURE.md)
3. Existing feature implementation in `/src/features/orders/`

---

**Built with ❤️ for restaurant management**

*Last updated: 2024*
