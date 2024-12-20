import { Product } from "@/types/product";

/**
 * Fetch All Products
 *
 * This function fetches a paginated list of published products from the
 * WordPress GraphQL API. It uses the `GRAPHQL_QUERY_GET_ALL_PUBLISHED_PRODUCTS`
 * query to retrieve product details, pagination info, and other metadata.
 *
 * @param {number} first - The number of products to fetch per request.
 * @param {string | null} after - The cursor for pagination. Use `null` for the first page.
 * @returns {Promise<ProductsResponse>} An object containing:
 *   - items: Array of products.
 *   - hasNextPage: Boolean indicating if more pages are available.
 *   - endCursor: Cursor for the next page.
 * @throws {Error} If the request fails or the response is invalid.
 *
 * Note:
 * - Caches the response for 60 seconds using the `next.revalidate` option.
 * - Logs the `first` parameter for debugging purposes.
 */

import { GRAPHQL_QUERY_GET_ALL_PUBLISHED_PRODUCTS } from "@/graphql/queries/products/getAllPublishedProducts";

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
  const response = await fetch(WORDPRESS_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY_GET_ALL_PUBLISHED_PRODUCTS,
      variables: { first, after },
    }),
    next: {
      revalidate: 60, // Revalidate the cached data every 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const result = await response.json();

  const edges = result?.data?.products?.edges || [];
  const items = edges.map((edge: any) => ({
    cursor: edge.cursor,
    ...edge.node,
  }));

  return {
    items,
    hasNextPage: result?.data?.products?.pageInfo?.hasNextPage || false,
    endCursor: result?.data?.products?.pageInfo?.endCursor || null,
  };
};

// --------------------------- end of fetchAllProducts -----------------------------------------

/**
 * Fetch Total Product Count
 *
 * This function sends a GraphQL request to fetch the total count of
 * published products from the WordPress backend. It utilizes the
 * `GetTotalProducts` query defined in `/graphql/queries/products/getTotalProductCount.ts`.
 *
 * The total count is essential for setting up pagination by determining
 * the total number of pages and rendering pagination controls.
 *
 * @returns {Promise<number>} The total number of published products.
 * @throws {Error} If the request fails or the response is invalid.
 */
export const fetchTotalProductCount = async (): Promise<number> => {
  const response = await fetch(WORDPRESS_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query GetTotalProducts {
          totalProducts
        }
      `,
    }),
    next: {
      revalidate: 60, // Cache the result for 60 seconds
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch total product count: ${response.statusText}`
    );
  }

  const result = await response.json();
  const totalProducts = result?.data?.totalProducts;

  if (typeof totalProducts !== "number") {
    throw new Error("Invalid response for total product count.");
  }

  return totalProducts;
};

// ---------------------------- end of fetchTotalProductCount -----------------------------------

/**
 * Fetch Product by ID
 *
 * This function retrieves a single product by its unique database ID from
 * the WordPress GraphQL API. It uses the `GRAPHQL_QUERY_GET_PRODUCT_BY_ID`
 * query to fetch detailed information about the specified product.
 *
 * @param {number} id - The unique database ID of the product to fetch.
 * @returns {Promise<Product | null>} The product data, or `null` if not found.
 * @throws {Error} If the request fails, the response contains errors, or the product is not found.
 *
 * Note:
 * - Throws an error for non-200 HTTP responses or if the GraphQL query returns errors.
 * - Ensure that the `WORDPRESS_API_URL` environment variable is correctly configured.
 */
import { GRAPHQL_QUERY_GET_PRODUCT_BY_ID } from "@/graphql/queries/products/getProductsById";

export const fetchProductById = async (id: number) => {
  const response = await fetch(WORDPRESS_API_URL as string, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY_GET_PRODUCT_BY_ID,
      variables: { id },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product with ID ${id}: ${response.statusText}`
    );
  }

  const result = await response.json();

  if (result.errors) {
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  return result.data?.product || null;
};

// ------------------------------- end of fetchProductById -------------------------------------
