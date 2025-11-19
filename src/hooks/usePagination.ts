import { useEffect, useMemo } from "react";

interface PaginationResult<T> {
  pageItems: T[];
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

// Generic pagination hook for any list that is already filtered
export function usePagination<T>(
  items: T[],
  currentPage: number,
  setCurrentPage: (n: number) => void,
  itemsPerPage: number,
  totalItemsOverride?: number
): PaginationResult<T> {
  const totalItems = typeof totalItemsOverride === "number" ? totalItemsOverride : items.length;
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / itemsPerPage));

  const startIndex = Math.min(
    (currentPage - 1) * itemsPerPage,
    Math.max(0, totalItems - 1)
  );
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const pageItems = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

  // Clamp currentPage if it exceeds totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage, setCurrentPage]);

  return { pageItems, totalItems, totalPages, startIndex, endIndex };
}