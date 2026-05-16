/**
 * Orders React Query Hooks
 *
 * WHY HOOKS LIVE HERE AND NOT IN PAGES:
 * Pages should be dumb renderers. Business logic (how to fetch, when to
 * invalidate, how to do optimistic updates) lives in hooks.
 *
 * Each hook is pure and composable — the OrdersListPage uses all of them,
 * the KitchenQueueWidget uses only useOrderQueue().
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  fetchOrders, fetchOrderById, createOrder,
  updateOrderStatus, deleteOrder, fetchOrderQueue, fetchOrderStats,
} from '../api/index.js';
import { QUERY_KEYS } from '../../../constants/queryKeys.js';

/** Fetch paginated/filtered orders list */
export function useOrders(filters = {}) {
  return useQuery({
    queryKey:  QUERY_KEYS.orders.list(filters),
    queryFn:   () => fetchOrders(filters),
    staleTime: 30_000,
  });
}

/** Fetch a single order */
export function useOrder(orderId) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.detail(orderId),
    queryFn:  () => fetchOrderById(orderId),
    enabled:  !!orderId,
  });
}

/** Fetch kitchen queue */
export function useOrderQueue(params) {
  return useQuery({
    queryKey:         QUERY_KEYS.orders.queue(),
    queryFn:          () => fetchOrderQueue(params),
    staleTime:        10_000,
    refetchInterval:  30_000, // auto-refresh kitchen queue every 30s
  });
}

/** Fetch order statistics for dashboard */
export function useOrderStats(range) {
  return useQuery({
    queryKey: QUERY_KEYS.orders.stats(range),
    queryFn:  () => fetchOrderStats(range),
    staleTime: 60_000,
  });
}

/** Create a new order — with cache invalidation */
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createOrder,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() });
    },
  });
}

/**
 * Update order status — with OPTIMISTIC UPDATE
 *
 * Optimistic update pattern:
 *  1. onMutate: immediately update cache (UI feels instant)
 *  2. onError:  rollback to previous state if server fails
 *  3. onSettled: always re-fetch from server to ensure consistency
 */
export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),

    onMutate: async ({ orderId, status }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await qc.cancelQueries({ queryKey: QUERY_KEYS.orders.all() });

      // Snapshot the previous value for rollback
      const previous = qc.getQueryData(QUERY_KEYS.orders.all());

      // Optimistically update all matching query cache entries
      qc.setQueriesData({ queryKey: QUERY_KEYS.orders.all() }, (old) => {
        if (!Array.isArray(old)) return old;
        return old.map(o => o.orderId === orderId ? { ...o, status } : o);
      });

      return { previous };
    },

    onError: (_err, _vars, context) => {
      // Rollback on failure
      if (context?.previous) {
        qc.setQueryData(QUERY_KEYS.orders.all(), context.previous);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() });
    },
  });
}

/** Delete order */
export function useDeleteOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() }),
  });
}
