import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, RenderHookOptions } from '@testing-library/react-native';
import React, { PropsWithChildren } from 'react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
}

export async function renderHookWithClient<Result, Props>(
  hook: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'> & {
    queryClient?: QueryClient;
  }
) {
  const queryClient = options?.queryClient ?? createTestQueryClient();

  const wrapper = ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const rendered = await renderHook(hook, { ...options, wrapper });

  return {
    ...rendered,
    queryClient,
  };
}
