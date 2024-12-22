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
  const { products, setProducts } = useProductStore();
  const { setTotalProducts, setCursor, setPageData } =
    useNumberedPaginationStore();

  // On initial load, sync SSR-fetched products into the Zustand store
  useEffect(() => {
    // Hydrate Zustand stores with SSR-fetched data
    setProducts(initialProducts);
    setTotalProducts(totalProducts);
    setCursor(0, initialCursor);
    setPageData(1, initialProducts); // Cache Page 1
  }, [initialProducts, initialCursor, setProducts]);

  // console.log("Products in Store: [PRODUCT LIST]", products);

  return (
    <>
      {products.map((product) => (
        <ProductListItem key={product.databaseId} product={product} />
      ))}
    </>
  );
};

export default ProductList;
