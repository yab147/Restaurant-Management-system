import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '../api/index.js';
import { QUERY_KEYS } from '../../../constants/queryKeys.js';

export function usePayments(filters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.payments.list(filters),
    queryFn:  () => paymentsApi.getAll(filters),
    staleTime: 30_000,
  });
}

export function usePaymentStats(range, options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.payments.stats(range),
    queryFn:  () => paymentsApi.getStats(range),
    staleTime: 60_000,
    ...options,
  });
}

export function useProcessPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.process,
    onSuccess:  () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.payments.all() });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.orders.all() });
    },
  });
}

export function useRefundPayment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentsApi.refund,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.payments.all() }),
  });
}
