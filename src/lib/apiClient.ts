
export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const hasBody = options?.body !== undefined && options?.body !== null;
  const isFormData = typeof FormData !== 'undefined' && options?.body instanceof FormData;

  const headers: HeadersInit = {
    ...(hasBody && !isFormData ? { "Content-Type": "application/json" } : {}),
    ...(options?.headers ?? {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: options?.credentials ?? "include",
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "API Error");
  }

  return res.json();
}
