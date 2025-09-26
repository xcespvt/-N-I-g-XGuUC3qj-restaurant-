import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildUrl(baseUrl: string, params?: Record<string, unknown>): string {
  if (!params || Object.keys(params).length === 0) return baseUrl

  const url = new URL(baseUrl, typeof window !== 'undefined' ? window.location.origin : undefined)
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, String(v)))
    } else if (typeof value === 'object') {
      url.searchParams.append(key, JSON.stringify(value))
    } else {
      url.searchParams.append(key, String(value))
    }
  })

  return url.toString()
}
