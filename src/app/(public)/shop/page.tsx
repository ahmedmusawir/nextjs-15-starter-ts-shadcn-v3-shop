import { fetchProductById } from "@/services/productServices";
import ShopPageContent from "./ShopPageContent";

const Shop = async () => {
  // JUST FOR TESTING ... PLZ REMOVE THE FOLLOWING
  // const response = await fetchProductById(3733);
  // console.log("Product by id [shop/page.tsx]", response);
  return <ShopPageContent />;
};

export default Shop;
