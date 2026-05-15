/**
 * Query Provider
 * Sets up React Query with optimal defaults for an ERP system
 */

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create query client with production-ready defaults
export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            // Data is fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache is kept for 10 minutes
            gcTime: 10 * 60 * 1000, // renamed from cacheTime in v5
            // Retry failed requests 3 times with exponential backoff
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Keep previous data while fetching new data (good UX for pagination)
            keepPreviousData: true,
            // Refetch on window focus
            refetchOnWindowFocus: true,
            // Refetch on mount if stale
            refetchOnMount: 'stale',
        },
        mutations: {
            // Retry mutations 1 time
            retry: 1,
        },
    },
});

export function QueryProvider({ children }) {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

export default QueryProvider;
