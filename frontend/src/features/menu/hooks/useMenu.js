import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi } from '../api/index.js';
import { QUERY_KEYS } from '../../../constants/queryKeys.js';

export function useMenuItems(filters = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.menu.list(filters),
    queryFn:  () => menuApi.getAll(filters),
    staleTime: 60_000,
  });
}

export function useMenuCategories() {
  return useQuery({
    queryKey: QUERY_KEYS.menu.categories(),
    queryFn:  menuApi.getCategories,
    staleTime: 5 * 60_000,
  });
}

export function useCreateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: menuApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.menu.all() }),
  });
}

export function useUpdateMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => menuApi.update(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.menu.all() }),
  });
}

export function useDeleteMenuItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: menuApi.delete,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.menu.all() }),
  });
}

export function useToggleMenuAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, availability }) => menuApi.toggleAvailability(id, availability),
    onMutate: async ({ id, availability }) => {
      await qc.cancelQueries({ queryKey: QUERY_KEYS.menu.all() });
      const previous = qc.getQueryData(QUERY_KEYS.menu.list({}));
      qc.setQueriesData({ queryKey: QUERY_KEYS.menu.all() }, old =>
        Array.isArray(old) ? old.map(m => m.itemId === id ? { ...m, availability } : m) : old
      );
      return { previous };
    },
    onError: (_e, _v, ctx) => { if (ctx?.previous) qc.setQueryData(QUERY_KEYS.menu.list({}), ctx.previous); },
    onSettled: () => qc.invalidateQueries({ queryKey: QUERY_KEYS.menu.all() }),
  });
}
