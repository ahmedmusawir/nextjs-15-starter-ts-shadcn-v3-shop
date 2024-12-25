import { create } from "zustand";
import { persist } from "zustand/middleware";
import localforage from "localforage";
import { Product } from "@/types/product";

// Define the state and actions for the store
interface ProductStore {
  products: Product[]; // Array to store the products
  isLoading: boolean; // Loading state for product hydration
  hasHydrated: boolean; // Indicates if the store has been hydrated
  setIsLoading: (loading: boolean) => void; // Action to set loading state
  setProducts: (products: Product[]) => void; // Action to set the products
  addProducts: (products: Product[]) => void; // Action to append new products
  markHydrated: () => void; // Action to mark the store as hydrated
}

// Create a custom storage using localforage
const localForageStorage = {
  getItem: async (name: string) => {
    const value = await localforage.getItem(name);
    return value !== null ? JSON.parse(value as string) : null;
  },
  setItem: async (name: string, value: any) => {
    await localforage.setItem(name, JSON.stringify(value));
  },
  removeItem: async (name: string) => {
    await localforage.removeItem(name);
  },
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [], // Initialize with an empty array
      isLoading: true, // Start with loading state as true
      hasHydrated: false, // Track hydration status

      setIsLoading: (loading) => set({ isLoading: loading }),

      // Overwrite the current products
      setProducts: (products) =>
        set((state) => {
          // Prevent overwriting if already hydrated
          if (state.hasHydrated) return state;
          return { products, isLoading: false };
        }),

      // Append new products to the store
      addProducts: (products) =>
        set((state) => ({
          products: [...state.products, ...products],
        })),

      // Mark the store as hydrated
      markHydrated: () => set({ hasHydrated: true, isLoading: false }),
    }),
    {
      name: "product-storage", // Name for IndexDB storage
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false); // Set loading to false after hydration
      },
      storage: localForageStorage, // Use localForage as storage
    }
  )
);