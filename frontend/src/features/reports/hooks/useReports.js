import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '../api/index.js';
import { QUERY_KEYS } from '../../../constants/queryKeys.js';

export function useSalesReport(range = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.reports.sales(range),
    queryFn:  () => reportsApi.getSalesSummary(range),
    staleTime: 5 * 60_000,
  });
}

export function useTopItemsReport(range = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.reports.top(range),
    queryFn:  () => reportsApi.getTopItems(range),
    staleTime: 5 * 60_000,
  });
}

export function useDashboardReport(range = {}) {
  return useQuery({
    queryKey: QUERY_KEYS.reports.summary(range),
    queryFn:  () => reportsApi.getDashboard(range),
    staleTime: 60_000,
  });
}
