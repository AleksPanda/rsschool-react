import { QueryClient } from '@tanstack/react-query';

const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

function getCacheTtl(): number {
  const cacheTtl = Number(import.meta.env.VITE_CACHE_TTL);

  return Number.isFinite(cacheTtl) && cacheTtl > 0
    ? cacheTtl
    : DEFAULT_CACHE_TTL;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: getCacheTtl(),
    },
  },
});
