/* 
Product Types for WooCommerce GraphQL Query
Description: Defines the structure of a single product and the product store.
 - Product: Represents a single product with its key details.
 - ProductCategory: Represents product categories attached to a product.
 - ProductStore: Represents the list of products.
*/

export interface ProductCategory {
  name: string;
}

export interface Product {
  id: string; // GraphQL uses strings for IDs
  databaseId: number; // Internal numeric ID
  name: string;
  slug: string;
  sku: string | null; // SKU can be null
  price: string; // Price range or single price as string
  productCategories: {
    nodes: ProductCategory[];
  };
  image: {
    sourceUrl: string;
  };
}

export interface ProductStore {
  products: Product[];
}
