"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import Link from "next/link";
import { useEffect } from "react";
import Spinner from "../common/Spinner";

const Cart = () => {
  const router = useRouter();

  // Zustand store
  const {
    cartDetails,
    subtotal,
    isCartOpen,
    isLoading,
    fetchCartDetails,
    removeFromCart,
    setIsCartOpen,
    increaseCartQuantity,
    decreaseCartQuantity,
  } = useCartStore();

  // Fetch cart details when the cart opens
  useEffect(() => {
    if (isCartOpen) {
      fetchCartDetails();
    }
  }, [isCartOpen, fetchCartDetails]);

  const goBackToShop = () => {
    router.push("/shop");
    setIsCartOpen(false);
  };

  return (
    <Dialog open={isCartOpen} onClose={setIsCartOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out"
      />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">
                      Shopping cart
                    </DialogTitle>
                    <button
                      type="button"
                      onClick={() => setIsCartOpen(false)}
                      className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                    >
                      <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                      <span className="sr-only">Close panel</span>
                    </button>
                  </div>

                  {/* {isLoading && <Spinner />} */}

                  <div className="mt-8">
                    {isLoading ? (
                      <Spinner />
                    ) : cartDetails.length === 0 ? (
                      <h3 className="mt-12">The Shopping Cart is empty!</h3>
                    ) : (
                      <div className="flow-root">
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {cartDetails.map((cartItem) => (
                            <li key={cartItem.id} className="flex py-6">
                              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  src={cartItem.productDetails.image.sourceUrl}
                                  alt={cartItem.productDetails.name}
                                  className="h-full w-full object-cover object-center"
                                />
                              </div>
                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{cartItem.productDetails.name}</h3>
                                    <p className="ml-4">
                                      {cartItem.productDetails.price}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <div className="flex items-center">
                                    <button
                                      className="text-gray-700"
                                      onClick={() =>
                                        decreaseCartQuantity(cartItem.id)
                                      }
                                    >
                                      -
                                    </button>
                                    <span className="mx-2">
                                      {cartItem.quantity}
                                    </span>
                                    <button
                                      className="text-gray-700"
                                      onClick={() =>
                                        increaseCartQuantity(cartItem.id)
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                  <button
                                    className="font-medium text-red-600 hover:text-red-500"
                                    onClick={() => removeFromCart(cartItem.id)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${subtotal}</p>
                  </div>
                  <div className="mt-6">
                    <Link
                      href={cartDetails.length > 0 ? "/checkout" : "#"}
                      className={`flex items-center justify-center rounded-md px-6 py-3 text-base font-medium shadow-sm ${
                        cartDetails.length > 0
                          ? "bg-indigo-600 text-white hover:bg-indigo-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Checkout
                    </Link>
                    <button
                      type="button"
                      onClick={goBackToShop}
                      className="mt-4 w-full text-center text-indigo-600 hover:text-indigo-500"
                    >
                      Continue Shopping &rarr;
                    </button>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default Cart;
