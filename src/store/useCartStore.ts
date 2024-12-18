import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { CartDetail, CartItem } from "@/types/cart";
import { fetchProductById } from "@/services/productServices";

// Type for the Zustand store
interface CartStore {
  cartItems: CartItem[]; // The list of items in the cart
  productCache: { [key: number]: any }; // Cache for fetched product details
  isCartOpen: boolean; // Whether the cart drawer is open
  isLoading: boolean; // To check the loading state
  setIsLoading: (loading: boolean) => void;
  setIsCartOpen: (isOpen: boolean) => void;
  setCartItems: (newCartItems: CartItem[]) => void;
  getItemQuantity: (itemId: number) => number;
  increaseCartQuantity: (itemId: number) => void;
  decreaseCartQuantity: (itemId: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  fetchCartDetails: () => Promise<void>; // Fetch and populate cart details
  cartDetails: CartDetail[]; // An array of resolved cart details
  subtotal: number; // Subtotal is a number
}

// Define the Zustand store with persist middleware
export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: [],
      productCache: {}, // Initialize product cache
      isCartOpen: false,
      isLoading: true,
      cartDetails: [],
      subtotal: 0,

      setIsLoading: (loading) => set({ isLoading: loading }),
      setIsCartOpen: (isOpen) => set({ isCartOpen: isOpen }),
      // Fetch cart details dynamically and populate state
      // fetchCartDetails: async () => {
      //   const { cartItems, productCache } = get();

      //   const detailedCartItems = await Promise.all(
      //     cartItems.map(async (cartItem) => {
      //       if (productCache[cartItem.id]) {
      //         return { ...cartItem, productDetails: productCache[cartItem.id] };
      //       }

      //       const product = await fetchProductById(cartItem.id);
      //       set((state) => ({
      //         productCache: { ...state.productCache, [cartItem.id]: product },
      //       }));
      //       return { ...cartItem, productDetails: product };
      //     })
      //   );

      //   // Update cartDetails
      //   set({ cartDetails: detailedCartItems });

      //   // Calculate and update subtotal
      //   const subtotal = detailedCartItems.reduce((acc, item) => {
      //     return (
      //       acc +
      //       parseFloat(item.productDetails.price.replace("$", "")) *
      //         item.quantity
      //     );
      //   }, 0);
      //   set({ subtotal: parseFloat(subtotal.toFixed(2)) });
      // },

      fetchCartDetails: async () => {
        set({ isLoading: true }); // Start loading

        const { cartItems, productCache } = get();

        const detailedCartItems = await Promise.all(
          cartItems.map(async (cartItem) => {
            if (productCache[cartItem.id]) {
              return { ...cartItem, productDetails: productCache[cartItem.id] };
            }

            const product = await fetchProductById(cartItem.id);
            set((state) => ({
              productCache: { ...state.productCache, [cartItem.id]: product },
            }));
            return { ...cartItem, productDetails: product };
          })
        );

        set({
          cartDetails: detailedCartItems,
          subtotal: parseFloat(
            detailedCartItems
              .reduce(
                (acc, item) =>
                  acc +
                  parseFloat(item.productDetails.price.replace("$", "")) *
                    item.quantity,
                0
              )
              .toFixed(2)
          ),
          isLoading: false, // Stop loading
        });
      },

      setCartItems: (newCartItems: CartItem[]) =>
        set({ cartItems: newCartItems }),

      getItemQuantity: (itemId) =>
        get().cartItems.find((item) => item.id === itemId)?.quantity || 0,

      increaseCartQuantity: (itemId) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (item) => item.id === itemId
          );

          const newCartItems = existingItem
            ? state.cartItems.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...state.cartItems, { id: itemId, quantity: 1 }];

          set({ cartItems: newCartItems }); // Update cart items
          get().fetchCartDetails(); // Refresh cartDetails and subtotal
          return {};
        }),

      decreaseCartQuantity: (itemId) =>
        set((state) => {
          const updatedCartItems = state.cartItems
            .map((item) =>
              item.id === itemId
                ? { ...item, quantity: Math.max(item.quantity - 1, 0) }
                : item
            )
            .filter((item) => item.quantity > 0);

          set({ cartItems: updatedCartItems }); // Update cart items
          get().fetchCartDetails(); // Refresh cartDetails and subtotal
          return {};
        }),

      removeFromCart: (itemId) =>
        set((state) => {
          const updatedCartItems = state.cartItems.filter(
            (item) => item.id !== itemId
          );

          set({ cartItems: updatedCartItems }); // Update cart items
          get().fetchCartDetails(); // Refresh cartDetails and subtotal
          return {};
        }),

      clearCart: () => set({ cartItems: [] }),
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
