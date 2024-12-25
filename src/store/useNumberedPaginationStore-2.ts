import { fetchAllProducts } from "@/services/productServices";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";
import { useProductStore } from "./useProductStore";
import { Product } from "@/types/product";

// Define the state and actions for pagination
interface NumberedPaginationStore {
  currentPage: number;
  totalProducts: number;
  productsPerPage: number;
  totalPages: number;
  cursors: (string | null)[];
  pageData: Record<number, Product[]>;
  setTotalProducts: (count: number) => void;
  setCursor: (page: number, cursor: string | null) => void;
  setPageData: (page: number, products: Product[]) => void;
  goToPage: (page: number) => Promise<void>;
  nextPage: () => Promise<void>;
  prevPage: () => Promise<void>;
  resetPagination: (
    initialProducts: Product[],
    initialCursor: string | null
  ) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useNumberedPaginationStore = create<NumberedPaginationStore>()(
  persist(
    (set, get) => ({
      currentPage: 1,
      totalProducts: 0,
      productsPerPage: 12,
      totalPages: 0,
      cursors: [null],
      pageData: {},
      loading: false,

      setLoading: (loading) => set({ loading }),

      setPageData: (page, products) =>
        set((state) => ({
          pageData: { ...state.pageData, [page]: products },
        })),

      setCursor: (page, cursor) => {
        set((state) => {
          const updatedCursors = [...state.cursors];
          updatedCursors[page - 1] = cursor;
          return { cursors: updatedCursors };
        });
      },

      setTotalProducts: (count) =>
        set((state) => ({
          totalProducts: count,
          totalPages: Math.ceil(count / state.productsPerPage),
        })),

      resetPagination: (initialProducts, initialCursor) => {
        const productStore = useProductStore.getState();
        productStore.setProducts(initialProducts); // Reset products to initial SSR data
        set({
          currentPage: 1,
          cursors: [initialCursor],
          pageData: { 1: initialProducts }, // Cache initial page data
        });
      },

      goToPage: async (page) => {
        const { totalPages, cursors, productsPerPage, setLoading } = get();
        const productStore = useProductStore.getState();

        if (page < 1 || page > totalPages) return;

        setLoading(true);

        try {
          const cursor = cursors[page - 1] || null;

          const productsResponse = await fetchAllProducts(
            productsPerPage,
            cursor
          );
          const newProducts = productsResponse.items;

          if (newProducts.length > 0) {
            productStore.setProducts(newProducts);
            set((state) => ({
              currentPage: page,
              pageData: { ...state.pageData, [page]: newProducts },
              cursors: [...state.cursors, productsResponse.endCursor],
            }));
          }
        } catch (error) {
          console.error("[goToPage] Error:", error);
        } finally {
          setLoading(false);
        }
      },

      nextPage: async () => {
        const { currentPage, totalPages, goToPage } = get();
        if (currentPage < totalPages) {
          await goToPage(currentPage + 1);
        }
      },

      prevPage: async () => {
        const { currentPage, goToPage } = get();
        if (currentPage > 1) {
          await goToPage(currentPage - 1);
        }
      },
    }),
    {
      name: "numbered-pagination-storage",
      storage: createJSONStorage(() => localforage),
      partialize: (state) => ({
        currentPage: state.currentPage,
        totalProducts: state.totalProducts,
        productsPerPage: state.productsPerPage,
        totalPages: state.totalPages,
        pageData: state.pageData,
      }),
    }
  )
);
