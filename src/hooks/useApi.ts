// src/hooks/useApi.ts
import {
  useQuery,
  UseQueryOptions,
  useMutation,
  UseMutationOptions,
} from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

// ✅ Generic GET
export function useGet<T>(
  key: string[], // query key
  url: string, // API endpoint
  options?: Omit<UseQueryOptions<T>, "queryKey" | "queryFn">
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: () => apiClient<T>(url),
    ...options,
  });
}

// ✅ Generic POST (can also handle PUT/PATCH/DELETE)
export function usePost<TData, TVariables>(
  url: string,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn">
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables: TVariables) =>
      apiClient<TData>(url, {
        method: "POST",
        body: JSON.stringify(variables),
      }),
    ...options,
  });
}
