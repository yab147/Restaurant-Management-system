import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tablesApi } from '../api/index.js';
import { QUERY_KEYS } from '../../../constants/queryKeys.js';

export function useTables() {
  return useQuery({
    queryKey: QUERY_KEYS.tables.list(),
    queryFn:  tablesApi.getAll,
    staleTime: 30_000,
  });
}

export function useCreateTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tablesApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.tables.all() }),
  });
}

export function useUpdateTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => tablesApi.update(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.tables.all() }),
  });
}

export function useUpdateTableStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => tablesApi.updateStatus(id, status),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: QUERY_KEYS.tables.all() });
      const prev = qc.getQueryData(QUERY_KEYS.tables.list());
      qc.setQueryData(QUERY_KEYS.tables.list(), old =>
        Array.isArray(old) ? old.map(t => t.tableId === id ? { ...t, status } : t) : old
      );
      return { prev };
    },
    onError: (_e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(QUERY_KEYS.tables.list(), ctx.prev); },
    onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.tables.all() }),
  });
}

export function useDeleteTable() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: tablesApi.delete,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.tables.all() }),
  });
}
