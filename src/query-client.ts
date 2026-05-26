import { QueryClient } from '@tanstack/react-query';

const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

const cacheTtl = Number(import.meta.env.VITE_CACHE_TTL);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Number.isFinite(cacheTtl) ? cacheTtl : DEFAULT_CACHE_TTL,
    },
  },
});
