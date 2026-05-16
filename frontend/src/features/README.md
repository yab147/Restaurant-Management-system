/**
 * Feature Structure Template
 * Copy this structure for each new feature domain (inventory, menu, payments, etc.)
 * 
 * Replace "FEATURE_NAME" with your actual feature name
 */

// /src/features/FEATURE_NAME/
//
// ├── api/
// │   └── index.js                    # API calls for this feature
// │       - Export functions: fetch*, create*, update*, delete*
// │       - Use apiClient from /services/api/axios.js
// │       - Handle error responses consistently
// │
// ├── store/
// │   └── useFeatureStore.js          # Zustand store for UI state (not server state)
// │       - UI filters, selected items, modals, form state
// │       - NOT for data from server (use React Query for that)
// │       - Example: selected tab, search filters, form draft
// │
// ├── hooks/
// │   └── useFeature.js               # React Query hooks for server state
// │       - useFeature() - fetch list with filters
// │       - useFeatureDetail() - fetch single item
// │       - useCreateFeature() - mutation
// │       - useUpdateFeature() - mutation
// │       - useDeleteFeature() - mutation
// │       - Handle optimistic updates and cache invalidation
// │
// ├── types/
// │   └── index.js                    # Constants and types
// │       - Status enums (STATUSES, STATUS_LABELS, STATUS_COLORS)
// │       - Validation rules
// │       - Feature-specific constants
// │
// ├── validations/
// │   └── featureSchema.js            # Validation schemas
// │       - Form field rules (required, minLength, pattern, etc.)
// │       - validateFeature() helper function
// │
// ├── routes/
// │   └── index.js                    # Route definitions
// │       - Export featureRoutes array
// │       - Include permissions metadata
// │       - Lazy load page components
// │
// ├── pages/
// │   ├── FeatureListPage.jsx         # List/dashboard view
// │   ├── FeatureDetailPage.jsx       # Detail/edit view
// │   └── FeatureFormPage.jsx         # Create/edit form (optional)
// │
// ├── components/
// │   ├── FeatureTable.jsx            # Reusable components
// │   ├── FeatureFilter.jsx
// │   ├── FeatureModal.jsx
// │   └── FeatureCard.jsx
// │
// ├── services/
// │   └── index.js                    # Feature-specific services
// │       - Ex: data transformation, formatting
// │       - Export: formatFeature(), parseFeature(), etc.
// │
// └── utils/
//     └── index.js                    # Feature utilities
//         - Helper functions specific to this feature

/**
 * Pattern Checklist for New Features
 * 
 * [ ] Create directory structure (api, store, hooks, types, validations, routes, pages, components, services, utils)
 * [ ] Create api/index.js with all CRUD endpoints
 * [ ] Create store/useFeatureStore.js for UI state (filters, selected items, modals)
 * [ ] Create hooks/useFeature.js with React Query hooks for server state
 * [ ] Create types/index.js with constants (statuses, labels, colors, validation rules)
 * [ ] Create validations/featureSchema.js with form validation rules
 * [ ] Create routes/index.js with route definitions and permissions metadata
 * [ ] Create pages/FeatureListPage.jsx with list view
 * [ ] Create pages/FeatureDetailPage.jsx with detail/edit view
 * [ ] Create components for reusable UI elements (table, filters, modal, card)
 * [ ] Add to /src/app/routes.js route registry
 * [ ] Import feature routes in App.jsx
 */

/**
 * Feature Usage Example
 * 
 * In a page component:
 * 
 * import { useFeature, useCreateFeature } from '../hooks/useFeature.js';
 * import { useFeatureStore } from '../store/useFeatureStore.js';
 * import { usePermission } from '../../../providers/PermissionProvider.jsx';
 * import { PERMISSIONS } from '../../../permissions/matrix.js';
 * 
 * function FeatureListPage() {
 *   const { filters, setFilters } = useFeatureStore();
 *   const { hasPermission } = usePermission();
 * 
 *   // Server state management
 *   const { data, isLoading } = useFeature(filters);
 *   const { mutate: create } = useCreateFeature();
 * 
 *   // Permission check
 *   if (!hasPermission(PERMISSIONS.FEATURE_VIEW)) return <NotFound />;
 * 
 *   return (
 *     <div>
 *       {hasPermission(PERMISSIONS.FEATURE_CREATE) && <CreateButton />}
 *       {/* Render list */}
 *     </div>
 *   );
 * }
 * 
 * export default FeatureListPage;
 */

export const FEATURE_STRUCTURE = 'See comments above';
