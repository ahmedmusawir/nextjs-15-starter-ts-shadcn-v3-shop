"use client";

import Head from "next/head";
import React from "react";
import Page from "@/components/common/Page";
import { useCartStore } from "@/store/useCartStore";
import SingleProduct from "@/components/shop/product-page/SingleProduct";
import { ProductSingle } from "@/types/single-product";

interface Props {
  singleProduct: ProductSingle;
}

const SingleProductContent = ({ singleProduct }: Props) => {
  const { cartItems, setIsCartOpen, increaseCartQuantity, removeFromCart } =
    useCartStore();

  // Find the product by ID

  const isProductInCart = (productId: number) => {
    return cartItems.some((item) => item.id === productId);
  };
  const handleAddToCart = (id: number) => {
    increaseCartQuantity(id);
    setIsCartOpen(true);
  };
  const handleRemoveCartItem = (id: number) => {
    removeFromCart(id);
    setIsCartOpen(true);
  };

  return (
    <>
      <Head>
        <title>Next Page SingleProductContent</title>
        <meta name="description" content="This is the demo page" />
      </Head>
      <Page className={""} FULL={false}>
        <SingleProduct />
      </Page>
    </>
  );
};

export default SingleProductContent;
