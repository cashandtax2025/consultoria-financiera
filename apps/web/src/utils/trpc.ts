import type { AppRouter } from "@consultoria-financiera/api";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import {
  createTRPCClient,
  httpBatchLink,
  type TRPCClientError,
} from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { toast } from "sonner";
import superjson from "superjson";

const isAuthError = (error: unknown) => {
  const trpcError = error as TRPCClientError<AppRouter>;
  return (
    trpcError?.data?.code === "FORBIDDEN" ||
    trpcError?.data?.code === "UNAUTHORIZED" ||
    trpcError?.data?.code === "NOT_FOUND"
  );
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (isAuthError(error)) {
          return false;
        }
        return failureCount < 3;
      },
    },
    mutations: {
      retry: (failureCount, error) => {
        if (isAuthError(error)) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.meta?.skipGlobalErrorHandler) {
        return;
      }
      toast.error(error.message);
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (mutation.meta?.skipGlobalErrorHandler) {
        return;
      }
      toast.error(error.message);
    },
  }),
});

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        } as RequestInit);
      },
      transformer: superjson,
    }),
  ],
});

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});
