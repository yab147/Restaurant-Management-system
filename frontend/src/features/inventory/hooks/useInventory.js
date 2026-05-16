import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '../api/index.js';
import { QUERY_KEYS } from '../../../constants/queryKeys.js';

export function useInventory(filters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.inventory.list(filters),
    queryFn:  () => inventoryApi.getAll(filters),
    staleTime: 60_000,
  });
}

export function useLowStockAlerts() {
  return useQuery({
    queryKey: QUERY_KEYS.inventory.alerts(),
    queryFn:  inventoryApi.getLowStock,
    staleTime: 30_000,
  });
}

export function useCreateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all() }),
  });
}

export function useUpdateIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => inventoryApi.update(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all() }),
  });
}

export function useDeleteIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: inventoryApi.delete,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all() }),
  });
}

export function useRestockIngredient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, amount }) => inventoryApi.restock(id, amount),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.inventory.all() }),
  });
}
