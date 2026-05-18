import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '../api/index.js';
import { QUERY_KEYS } from '../../../constants/queryKeys.js';

export function useReservations(filters = {}, options = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.reservations.list(filters),
    queryFn:  () => reservationsApi.getAll(filters),
    staleTime: 30_000,
    ...options,
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reservationsApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.reservations.all() }),
  });
}

export function useUpdateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => reservationsApi.update(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.reservations.all() }),
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reservationsApi.cancel,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.reservations.all() }),
  });
}

export function useConfirmReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reservationsApi.confirm,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.reservations.all() }),
  });
}
