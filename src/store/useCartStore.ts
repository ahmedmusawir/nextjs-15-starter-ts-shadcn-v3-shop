import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useProductStore } from "@/store/useProductStore";
import { CartDetail, CartItem } from "@/types/cart";
import { Product } from "@/types/product";

// Type for the Zustand store
interface CartStore {
  cartItems: CartItem[]; // The list of items in the cart
  isCartOpen: boolean; // Whether the cart drawer is open
  isLoading: boolean; // To check the loading state
  setIsLoading: (loading: boolean) => void; // To Set loading state
  setIsCartOpen: (isOpen: boolean) => void; // Toggle the cart drawer
  setCartItems: (newCartItems: CartItem[]) => void; // Directly update cart items
  getItemQuantity: (itemId: number) => number; // Get the quantity of a specific item
  increaseCartQuantity: (itemId: number) => void; // Increment the quantity of a specific item
  decreaseCartQuantity: (itemId: number) => void; // Decrement the quantity of a specific item
  removeFromCart: (itemId: number) => void; // Remove an item from the cart
  clearCart: () => void; // Clear the entire cart
  cartDetails: () => CartDetail[]; // Get detailed cart items with product info
  subtotal: () => number; // Calculate the subtotal of all items in the cart
}

// Define the Zustand store with persist middleware
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      isCartOpen: false,
      isLoading: true,
      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      setCartItems: (newCartItems: CartItem[]) =>
        set({ cartItems: newCartItems }),
      getItemQuantity: (itemId) =>
        get().cartItems.find((item) => item.id === itemId)?.quantity || 0,
      increaseCartQuantity: (itemId) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === itemId
          );
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            return {
              cartItems: [...state.cartItems, { id: itemId, quantity: 1 }],
            };
          }
        }),
      decreaseCartQuantity: (itemId) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === itemId
          );
          if (existingItem?.quantity === 1) {
            return {
              cartItems: state.cartItems.filter((item) => item.id !== itemId),
            };
          } else {
            return {
              cartItems: state.cartItems.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity - 1 }
                  : item
              ),
            };
          }
        }),
      removeFromCart: (itemId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.id !== itemId),
        })),
      clearCart: () => set({ cartItems: [] }),
      cartDetails: () => {
        const cartItems = get().cartItems || [];
        const products = useProductStore.getState().products; // Fetch products from the Product Store

        return cartItems.map((cartItem) => {
          const product = products.find((p) => p.databaseId === cartItem.id);

          // If product is not found, return a placeholder productDetails
          const productDetails: Product = product || {
            id: cartItem.id.toString(),
            databaseId: cartItem.id,
            name: "Default Product Name",
            slug: "default-product-slug",
            sku: "default-sku",
            price: "0.00",
            productCategories: {
              nodes: [{ name: "Default Category" }],
            },
            image: {
              sourceUrl: "/default-image.png",
            },
            cursor: "default-cursor",
          };

          // Return a CartDetail object
          return {
            id: cartItem.id,
            quantity: cartItem.quantity,
            productDetails,
          };
        });
      },

      subtotal: () => {
        const cartItems = get().cartItems || [];
        const products = useProductStore.getState().products; // Fetch products from the Product Store
        return parseFloat(
          cartItems
            .reduce((acc, cartItem) => {
              const product = products.find(
                (p) => p.databaseId === cartItem.id
              );
              if (!product) return acc;
              return (
                acc +
                parseFloat(product.price.replace("$", "")) * cartItem.quantity
              );
            }, 0)
            .toFixed(2)
        );
      },
    }),
    {
      name: "cart-storage",
      onRehydrateStorage: () => (state) => {
        state?.setIsLoading(false);
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);
