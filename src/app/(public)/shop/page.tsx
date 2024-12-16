import { fetchAllProducts } from "@/services/productServices";
import ShopPageContent from "./ShopPageContent";

const Shop = async () => {
  // Fetching the first 12 products (you can adjust the numbers for testing)
  // const productsResponse = await fetchAllProducts(12, null);
  // console.log("Fetched Products Response:", productsResponse.items);

  return <ShopPageContent />;
};

export default Shop;
