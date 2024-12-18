"use client";

import { useCartStore } from "@/store/useCartStore";
import { Product } from "@/types/product";
import Link from "next/link";
import React from "react";

interface Props {
  product: Product;
}

const ProductListItem = ({ product }: Props) => {
  const { increaseCartQuantity, setIsCartOpen, removeFromCart, cartItems } =
    useCartStore();

  const isProductInCart = (productId: number) => {
    return cartItems.some((item) => item.id === productId);
  };

  const handleAddToCart = (id: number) => {
    console.log("Prod ID: (ShopPageContent)", id);
    increaseCartQuantity(id);
    setIsCartOpen(true);
  };
  const handleRemoveCartItem = (id: number) => {
    removeFromCart(id);
    setIsCartOpen(true);
  };
  return (
    <div key={product.id} className="group relative my-5">
      <Link href={`/shop/${product.databaseId}`}>
        <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
          <img
            src={product.image.sourceUrl}
            alt={product.name}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </Link>
      <section className="">
        <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {product.productCategories.nodes.map((cat) => cat.name)}
        </p>
        <p className="mt-1 text-sm font-medium text-gray-900">
          {product.price}
        </p>

        {!isProductInCart(product.databaseId) && (
          <button
            type="button"
            className="rounded-full bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 float-right xl:mb-10"
            onClick={() => handleAddToCart(product.databaseId)}
          >
            Add To Cart
          </button>
        )}
        {isProductInCart(product.databaseId) && (
          <button
            type="button"
            className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 float-right"
            onClick={() => handleRemoveCartItem(product.databaseId)}
          >
            Remove Item
          </button>
        )}
      </section>
    </div>
  );
};

export default ProductListItem;
