import { GRAPHQL_QUERY_GET_ALL_PUBLISHED_PRODUCTS } from "@/graphql/queries/products/getAllPublishedProducts";
import { Product } from "@/types/product";

const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL!;

interface ProductsResponse {
  items: Product[];
  hasNextPage: boolean;
  endCursor: string | null;
}

export const fetchAllProducts = async (
  first: number,
  after: string | null
): Promise<ProductsResponse> => {
  console.log(" [productServices.ts]:", first);
  const response = await fetch(WORDPRESS_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY_GET_ALL_PUBLISHED_PRODUCTS,
      variables: { first, after },
    }),
    // cache: "no-cache",
    next: {
      revalidate: 60, // Revalidate the cached data every 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const result = await response.json();

  return {
    items: result?.data?.products?.nodes || [],
    hasNextPage: result?.data?.products?.pageInfo?.hasNextPage || false,
    endCursor: result?.data?.products?.pageInfo?.endCursor || null,
  };
};
