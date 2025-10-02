// src/hooks/useApi.ts
import {
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { buildUrl } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

// ✅ Generic GET with optional params
export function useGet<T>(
  key: string[],
  url: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  // Construct the full URL with base URL
  const baseUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const finalUrl = params ? buildUrl(baseUrl, params) : baseUrl;

  return useQuery<T>({
    queryKey: params ? [...key, params] : key,
    queryFn: () => apiClient<T>(finalUrl),
    ...options,
  });
}

// ✅ Generic POST
export function usePost<TData, TVariables>(
  url: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) =>
      apiClient<TData>(url, {
        method: "POST",
        body: JSON.stringify(variables),
      }),
    ...options,
  });
}

type HttpMethod = "POST" | "PUT" | "PATCH" | "DELETE";

// ✅ Generic Mutation Request
export function useMutationRequest<TData, TVariables>(
  method: HttpMethod,
  url: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables: TVariables) =>
      apiClient<TData>(url, {
        method,
        body:
          method === "DELETE" ? undefined : JSON.stringify(variables),
      }),
    ...options,
  });
}

// ✅ PUT
export function usePut<TData, TVariables>(
  url: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) {
  return useMutationRequest<TData, TVariables>("PUT", url, options);
}

// ✅ PATCH
export function usePatch<TData, TVariables>(
  url: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) {
  return useMutationRequest<TData, TVariables>("PATCH", url, options);
}

// ✅ DELETE
export function useDelete<TData, TVariables = void>(
  url: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) {
  return useMutationRequest<TData, TVariables>("DELETE", url, options);
}

export function useAdd<TData = any>(
  options?: Omit<UseMutationOptions<TData, Error, any>, "mutationFn">
) {
  return usePost<TData, any>(`${API_BASE_URL}/restaurant/add-menu-item`, options);
}

// ✅ Query Helpers
export function useQueryHelpers() {
  const queryClient = useQueryClient();

  return {
    invalidate: async (key: unknown[]) =>
      queryClient.invalidateQueries({ queryKey: key }),
    reset: async (key: unknown[]) =>
      queryClient.resetQueries({ queryKey: key }),
    set: <TData>(key: unknown[], updater: TData) =>
      queryClient.setQueryData<TData>(key, updater),
    remove: (key: unknown[]) =>
      queryClient.removeQueries({ queryKey: key }),
  };
}
