"use client";

import { useEffect, useMemo } from "react";
import { useProductStore } from "@/store/useProductStore";
import ProductListItem from "@/components/shop/ProductListItem";
import { Product } from "@/types/product";
import { useNumberedPaginationStore } from "@/store/useNumberedPaginationStore";

interface ProductListProps {
  initialProducts: Product[]; // Server-side rendered initial products
  totalProducts: number; // Total product count
  initialCursor: string | null; // Cursor for the first page
}

const ProductList = ({
  initialProducts,
  totalProducts,
  initialCursor,
}: ProductListProps) => {
  const { products, setProducts, hasHydrated } = useProductStore();
  const { setTotalProducts, setCursor, setPageData, currentPage } =
    useNumberedPaginationStore();

  useEffect(() => {
    if (!hasHydrated) {
      // Hydrate Zustand store only if not hydrated
      setProducts(initialProducts);
      useProductStore.setState({ hasHydrated: true }); // Mark hydration complete
    }

    // Update pagination metadata
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

  // Dynamically decide data to render based on currentPage and Zustand state
  const dataToDisplay =
    currentPage === 1 && !products.length ? initialProducts : products;

  return (
    <>
      {dataToDisplay.map((product) => (
        <ProductListItem key={product.databaseId} product={product} />
      ))}
    </>
  );
};

export default ProductList;
