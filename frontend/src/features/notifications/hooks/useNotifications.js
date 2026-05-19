import { useQuery } from '@tanstack/react-query';
import apiClient from '../../../services/api/axios.js';

export const NOTIFICATIONS_KEY = ['notifications'];

async function fetchNotifications() {
  const { data } = await apiClient.get('/notifications');
  return data;
}

export function useNotifications(options = {}) {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: fetchNotifications,
    staleTime: 10_000,
    refetchInterval: 15_000,
    ...options,
  });
}
