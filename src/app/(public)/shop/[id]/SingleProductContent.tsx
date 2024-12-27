"use client";

import Head from "next/head";
import React from "react";
import {
  CheckIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import Page from "@/components/common/Page";
import { useParams } from "next/navigation";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import SingleProduct from "@/components/shop/product-page/SingleProduct";

const reviews = { average: 4, totalCount: 1624 };

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const SingleProductContent = () => {
  const params = useParams(); // Retrieve all route params
  const { id } = params; // Access the `id` parameter
  const products = useProductStore((state) => state.products);
  const { cartItems, setIsCartOpen, increaseCartQuantity, removeFromCart } =
    useCartStore();

  // Find the product by ID
  const product = products.find((p) => p.databaseId === Number(id));

  if (!product) {
    return <div>Product not found</div>;
  }

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
