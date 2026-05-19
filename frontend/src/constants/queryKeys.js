/**
 * React Query Key Factory
 *
 * WHY THIS EXISTS:
 * Query keys are the addressing system for React Query's cache. If you write
 * them as plain strings, you get subtle bugs:
 *   - ['orders'] vs ['order'] — typos cause cache misses
 *   - Invalidating ['orders'] won't invalidate ['orders', 'list', {...}]
 *     unless you know the key structure
 *
 * This factory uses array nesting so that:
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() })
 * ...invalidates EVERY orders query (list, detail, queue, stats) at once.
 * But:
 *   queryClient.invalidateQueries({ queryKey: QUERY_KEYS.orders.detail(5) })
 * ...only invalidates order #5's detail cache.
 *
 * This is the "hierarchical key" pattern used in production React Query apps.
 */

export const QUERY_KEYS = {
  orders: {
    all:    ()         => ['orders'],
    list:   (filters)  => ['orders', 'list', filters ?? {}],
    detail: (id)       => ['orders', 'detail', id],
    queue:  ()         => ['orders', 'queue'],
    stats:  (range)    => ['orders', 'stats', range ?? {}],
  },

  menu: {
    all:        ()        => ['menu'],
    list:       (filters) => ['menu', 'list', filters ?? {}],
    detail:     (id)      => ['menu', 'detail', id],
    categories: ()        => ['menu', 'categories'],
    publicItems: ()      => ['menu', 'public', 'items'],
    publicCategories: () => ['menu', 'public', 'categories'],
  },

  inventory: {
    all:    ()       => ['inventory'],
    list:   (filters)=> ['inventory', 'list', filters ?? {}],
    detail: (id)     => ['inventory', 'detail', id],
    alerts: ()       => ['inventory', 'alerts'],
  },

  payments: {
    all:    ()        => ['payments'],
    list:   (filters) => ['payments', 'list', filters ?? {}],
    detail: (id)      => ['payments', 'detail', id],
    stats:  (range)   => ['payments', 'stats', range ?? {}],
  },

  tables: {
    all:    ()   => ['tables'],
    list:   ()   => ['tables', 'list'],
    detail: (id) => ['tables', 'detail', id],
  },

  reservations: {
    all:    ()        => ['reservations'],
    list:   (filters) => ['reservations', 'list', filters ?? {}],
    detail: (id)      => ['reservations', 'detail', id],
  },

  reports: {
    all:    ()      => ['reports'],
    sales:  (range) => ['reports', 'sales', range ?? {}],
    top:    (range) => ['reports', 'top-items', range ?? {}],
    summary:(range) => ['reports', 'summary', range ?? {}],
  },

  users: {
    all:    ()   => ['users'],
    list:   ()   => ['users', 'list'],
    detail: (id) => ['users', 'detail', id],
  },

  dashboard: {
    all:     ()      => ['dashboard'],
    summary: (range) => ['dashboard', 'summary', range ?? {}],
  },
};
