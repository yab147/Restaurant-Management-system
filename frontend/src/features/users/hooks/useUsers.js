import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '../api/index.js';
import { QUERY_KEYS } from '../../../constants/queryKeys.js';

export function useUsers() {
  return useQuery({
    queryKey: QUERY_KEYS.users.list(),
    queryFn:  usersApi.getAll,
    staleTime: 2 * 60_000,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all() }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }) => usersApi.update(id, payload),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all() }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: usersApi.delete,
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all() }),
  });
}

export function useChangeUserRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }) => usersApi.changeRole(id, role),
    onSuccess:  () => qc.invalidateQueries({ queryKey: QUERY_KEYS.users.all() }),
  });
}
