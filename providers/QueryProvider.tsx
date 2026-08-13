import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { PropsWithChildren } from 'react';
import { queryPersister } from '~/lib/queryPersister';

const ONE_DAY = 1000 * 60 * 60 * 24;
const FIVE_MINUTES = 1000 * 60 * 5;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: ONE_DAY,
      staleTime: FIVE_MINUTES,
      retry: 2,
    },
  },
});

export default function QueryProvider({ children }: PropsWithChildren) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        buster: '1.0.0',
        maxAge: ONE_DAY,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.meta?.persist === true,
        },
      }}>
      {children}
    </PersistQueryClientProvider>
  );
}
