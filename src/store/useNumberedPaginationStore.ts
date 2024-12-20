import { fetchAllProducts } from "@/services/productServices";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";
import { useProductStore } from "./useProductStore";

// Define the state and actions for pagination
interface NumberedPaginationStore {
  currentPage: number; // Current active page
  totalProducts: number; // Total number of products
  productsPerPage: number; // Number of products displayed per page
  totalPages: number; // Total number of pages (calculated)
  setTotalProducts: (count: number) => void; // Action to set total products
  goToPage: (page: number) => Promise<void>; // Navigate to a specific page
  nextPage: () => Promise<void>; // Navigate to the next page
  prevPage: () => Promise<void>; // Navigate to the previous page
}

export const useNumberedPaginationStore = create<NumberedPaginationStore>()(
  persist(
    (set, get) => ({
      currentPage: 1, // Start at the first page
      totalProducts: 0, // Initialize with zero products
      productsPerPage: 6, // Default number of products per page
      totalPages: 0, // Dynamically calculated total pages

      // Set the total number of products and recalculate total pages
      setTotalProducts: (count) =>
        set((state) => ({
          totalProducts: count,
          totalPages: Math.ceil(count / state.productsPerPage),
        })),

      // Navigate to a specific page
      goToPage: async (page) => {
        const { productsPerPage, totalPages, currentPage } = get();
        const productStore = useProductStore.getState();

        console.log("[PaginationStore] Navigating to page:", page);

        if (page < 1 || page > totalPages) {
          console.error("Invalid page number:", page);
          return;
        }

        // Check if products for the requested page are already available
        if (page === currentPage) {
          console.log("[PaginationStore] Already on the requested page:", page);
          return;
        }

        // Calculate the cursor for the requested page
        const currentProducts = productStore.products;
        const afterCursor =
          page > 1 && currentProducts.length
            ? currentProducts[currentProducts.length - 1].cursor
            : null;

        console.log(
          "[PaginationStore] Calculated Cursor for Page:",
          afterCursor
        );

        try {
          // Fetch products for the requested page
          const productsResponse = await fetchAllProducts(
            productsPerPage,
            afterCursor
          );

          if (productsResponse.items.length > 0) {
            productStore.setProducts(productsResponse.items); // Set new page products
            set({ currentPage: page });
          } else {
            console.warn(
              `[PaginationStore] No products found for page ${page}. Retrying with page 1.`
            );
            set({ currentPage: 1 });
            const fallbackResponse = await fetchAllProducts(
              productsPerPage,
              null // Fallback to the first page
            );
            productStore.setProducts(fallbackResponse.items);
          }
        } catch (error) {
          console.error("[PaginationStore] Error fetching products:", error);
        }
      },

      // Navigate to the next page
      nextPage: async () => {
        const { currentPage, totalPages, productsPerPage } = get();
        const productStore = useProductStore.getState();

        if (currentPage < totalPages) {
          const afterCursor =
            productStore.products.length > 0
              ? productStore.products[productStore.products.length - 1].cursor
              : null;

          const productsResponse = await fetchAllProducts(
            productsPerPage,
            afterCursor
          );

          if (productsResponse.items.length > 0) {
            productStore.addProducts(productsResponse.items); // Append next page products
            set({ currentPage: currentPage + 1 });
          } else {
            console.error("No products found for the next page");
          }
        }
      },

      // Navigate to the previous page
      prevPage: async () => {
        const { currentPage, productsPerPage } = get();
        const productStore = useProductStore.getState();

        if (currentPage > 1) {
          const newPage = currentPage - 1;
          set({ currentPage: newPage });

          // Reset products for the new page
          const productsResponse = await fetchAllProducts(
            productsPerPage,
            null // Adjust cursor logic as necessary
          );

          if (productsResponse.items.length > 0) {
            productStore.setProducts(productsResponse.items); // Replace with previous page products
          } else {
            console.error("No products found for the previous page");
          }
        }
      },
    }),
    {
      name: "numbered-pagination-storage", // Key for localforage
      storage: createJSONStorage(() => localforage), // Use localforage for IndexedDB
      partialize: (state) => ({
        currentPage: state.currentPage,
        totalProducts: state.totalProducts,
        productsPerPage: state.productsPerPage,
        totalPages: state.totalPages,
      }), // Persist only relevant fields
    }
  )
);
