# Backend Architecture

This backend follows a **modular, production-level structure** inspired by the frontend's feature-based organization. Each feature module contains routes, controllers, and services.

## Folder Structure

```
backend/
├── db/
│   └── index.js                 # Database pool & query helper
├── middleware/
│   └── authMiddleware.js        # JWT authentication middleware
├── routes/
│   ├── auth.js                  # Authentication routes
│   ├── menu.js                  # Menu item & category routes
│   ├── menuCategories.js        # Legacy menu category route compatibility
│   ├── orders.js                # Order management routes
│   ├── payments.js              # Payment routes
│   ├── reports.js               # Reports and analytics routes
│   ├── reservations.js          # Reservation routes
│   ├── tables.js                # Restaurant table routes
│   ├── ingredients.js           # Inventory routes
│   └── users.js                 # User management routes
├── controllers/
│   ├── authController.js        # Auth logic (login, signup, refresh)
│   ├── ingredientsController.js # Inventory CRUD and restock logic
│   ├── menuController.js        # Menu CRUD operations
│   ├── ordersController.js      # Order CRUD & assignment
│   ├── paymentsController.js    # Payment processing and refund logic
│   ├── reportsController.js     # Sales, dashboard, and CSV reports
│   ├── reservationsController.js # Reservation CRUD & status
│   ├── tablesController.js      # Restaurant table CRUD and status
│   └── usersController.js       # User CRUD and role changes
├── server.js                    # Express app initialization & route mounting
├── package.json                 # Dependencies
├── .env                         # Environment variables (Railway DB config)
└── restaurant.sql              # Database schema
```

## Module Breakdown

### `/db` - Database Layer
- **Purpose**: Centralized database connection and query helper
- **File**: `index.js`
  - Exports `pool` (MySQL connection pool)
  - Exports `queryDB(sql, params)` helper for reusable queries

### `/middleware` - Express Middleware
- **Purpose**: Shared middleware for authentication, validation, error handling
- **File**: `authMiddleware.js`
  - `authenticate()`: JWT token verification for protected routes

### `/routes` - Route Definitions
- **Purpose**: Express router definitions that delegate to controllers
- **Files**:
  - `auth.js`: POST /api/auth/login, /signup, /refresh
  - `menu.js`: GET/POST/PUT/DELETE /api/menu/*, /categories
  - `menuCategories.js`: GET/POST /api/menu-categories
  - `orders.js`: GET/POST/PUT/DELETE /api/orders/*, /status, /assign, /stats, /queue
  - `payments.js`: GET/POST /api/payments/*, /stats, /refund
  - `reports.js`: GET /api/reports/sales, /top-items, /dashboard, /export
  - `reservations.js`: GET/POST/PUT/PATCH /api/reservations/*, /cancel, /confirm
  - `tables.js`: GET/POST/PUT/PATCH/DELETE /api/tables/*
  - `ingredients.js`: GET/POST/PUT/PATCH/DELETE /api/ingredients/*
  - `users.js`: GET/POST/PUT/PATCH/DELETE /api/users/*

### `/controllers` - Business Logic
- **Purpose**: Handle request processing, database operations, response formatting
- **Files**:
  - `authController.js`: `login()`, `signup()`, `refresh()` functions
  - `ingredientsController.js`: Inventory CRUD, low stock, and restock
  - `menuController.js`: Menu item and category CRUD
  - `ordersController.js`: Order operations with transaction support
  - `paymentsController.js`: Payment processing, stats, and refunds
  - `reportsController.js`: Dashboard/reporting queries
  - `reservationsController.js`: Reservation lifecycle management
  - `tablesController.js`: Table CRUD and status management
  - `usersController.js`: User CRUD and role changes

## API Endpoints

### Authentication
```
POST   /api/auth/login      - User login
POST   /api/auth/signup     - User registration
POST   /api/auth/refresh    - Refresh access token
```

### Menu
```
GET    /api/menu            - Get all menu items
POST   /api/menu            - Add menu item
PUT    /api/menu/:id        - Update menu item
DELETE /api/menu/:id        - Delete menu item
GET    /api/menu/categories - Get categories
POST   /api/menu/categories - Add category
```

### Orders
```
GET    /api/orders          - Get orders (filterable by status, waiterId)
GET    /api/orders/:id      - Get one order with items
GET    /api/orders/stats    - Get order dashboard statistics
GET    /api/orders/queue    - Get kitchen/order queue
POST   /api/orders          - Create order with items (transaction)
PUT    /api/orders/:id      - Update order
PUT    /api/orders/:id/status - Update order status
PUT    /api/orders/:id/assign - Assign order to waiter
DELETE /api/orders/:id      - Delete order
```

### Reservations
```
GET    /api/reservations    - Get reservations (filterable)
POST   /api/reservations    - Create reservation
PUT    /api/reservations/:id - Update reservation
PATCH  /api/reservations/:id/cancel   - Cancel reservation
PATCH  /api/reservations/:id/confirm  - Confirm reservation
```

### Tables
```
GET    /api/tables          - Get restaurant tables
GET    /api/tables/:id      - Get one table
POST   /api/tables          - Create table
PUT    /api/tables/:id      - Update table
PATCH  /api/tables/:id/status - Update table status
DELETE /api/tables/:id      - Delete table
```

### Inventory
```
GET    /api/ingredients     - Get ingredients
GET    /api/ingredients/low-stock - Get low stock ingredients
GET    /api/ingredients/:id - Get one ingredient
POST   /api/ingredients     - Create ingredient
PUT    /api/ingredients/:id - Update ingredient
PATCH  /api/ingredients/:id/restock - Restock ingredient
DELETE /api/ingredients/:id - Delete ingredient
```

### Payments
```
GET    /api/payments        - Get payments
GET    /api/payments/stats  - Get payment stats
GET    /api/payments/:id    - Get one payment
POST   /api/payments        - Process payment
POST   /api/payments/:id/refund - Refund payment
```

### Users
```
GET    /api/users           - Get users
GET    /api/users/:id       - Get one user
POST   /api/users           - Create user
PUT    /api/users/:id       - Update user
PATCH  /api/users/:id/role  - Change user role
DELETE /api/users/:id       - Delete user
```

### Reports
```
GET    /api/reports/sales     - Sales summary
GET    /api/reports/top-items - Top menu items
GET    /api/reports/dashboard - Dashboard report summary
GET    /api/reports/export    - Export orders CSV
```

## Running the Server

### Development
```bash
cd backend
npm install
npm run dev
```

### Production
```bash
cd backend
npm run start
```

## Environment Variables
Create a `.env` file:
```
MYSQLHOST=your-railway-host
MYSQLPORT=3306
MYSQLUSER=your-user
MYSQLPASSWORD=your-password
MYSQLDATABASE=restaurant
JWT_SECRET=your-secret
JWT_REFRESH_SECRET=your-refresh-secret
PORT=3001
```

## Design Principles

✅ **Modularity**: Each feature has its own route + controller files  
✅ **Separation of Concerns**: Routes delegate to controllers; controllers handle logic  
✅ **DRY**: Database helper centralized in `/db`  
✅ **Scalability**: Easy to add new features without modifying core files  
✅ **Middleware**: Reusable authentication & validation  
✅ **Transaction Support**: Orders use connection transactions for data integrity  

## Next Steps

- Add `services/` layer for complex business logic (email, notifications, reports)
- Add `validators/` layer for input validation (Joi, Zod)
- Add `utils/` for helper functions
- Add error handling middleware for consistent error responses
- Add logging middleware for debugging
