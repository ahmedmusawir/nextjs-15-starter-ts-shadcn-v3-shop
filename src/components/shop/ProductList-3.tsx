"use client";

import { useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";
import ProductListItem from "@/components/shop/ProductListItem";
import { Product } from "@/types/product";
import { useNumberedPaginationStore } from "@/store/useNumberedPaginationStore";

interface ProductListProps {
  initialProducts: Product[];
  totalProducts: number;
  initialCursor: string | null;
}

const ProductList = ({
  initialProducts,
  totalProducts,
  initialCursor,
}: ProductListProps) => {
  const { products, setProducts, hasHydrated } = useProductStore();
  const { setTotalProducts, setCursor, setPageData } =
    useNumberedPaginationStore();

  useEffect(() => {
    if (!hasHydrated) {
      // Only hydrate Zustand store if not already hydrated
      setProducts(initialProducts);
      useProductStore.setState({ hasHydrated: true }); // Mark hydration complete
    }

    // Always update pagination metadata
    setTotalProducts(totalProducts);
    setCursor(0, initialCursor);
    setPageData(1, initialProducts); // Cache Page 1
  }, [
    hasHydrated,
    initialProducts,
    initialCursor,
    totalProducts,
    setProducts,
    setTotalProducts,
    setCursor,
    setPageData,
  ]);

  return (
    <>
      {initialProducts.map((product) => (
        <ProductListItem key={product.databaseId} product={product} />
      ))}
    </>
  );
};

export default ProductList;
