import { useMemo, useEffect } from "react";
import type { MenuItem } from "@/context/useAppStore";

interface PaginationResult<T> {
  pageItems: T[];
  totalItems: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

export function useFilteredPagination(
  items: MenuItem[],
  activeCategory: string,
  searchTerm: string,
  currentPage: number,
  setCurrentPage: (n: number) => void,
  itemsPerPage: number,
  apiTotalItems?: number
): PaginationResult<MenuItem> {
  const filteredMenu = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        (activeCategory === "All" || item.category === activeCategory) &&
        item.name.toLowerCase().includes(term)
    );
  }, [items, activeCategory, searchTerm]);

  const isFiltered = searchTerm.trim() !== "" || activeCategory !== "All";
  const totalItems = isFiltered ? filteredMenu.length : (apiTotalItems ?? items.length);
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / itemsPerPage));
  const startIndex = Math.min(
    (currentPage - 1) * itemsPerPage,
    Math.max(0, totalItems - 1)
  );
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const pageItems = isFiltered
    ? filteredMenu.slice(startIndex, endIndex)
    : items;

  // Reset to first page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeCategory, setCurrentPage]);

  // Clamp currentPage if it exceeds totalPages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage, setCurrentPage]);

  return { pageItems, totalItems, totalPages, startIndex, endIndex };
}