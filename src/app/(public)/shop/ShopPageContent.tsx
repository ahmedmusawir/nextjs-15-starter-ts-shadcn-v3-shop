import Head from "next/head";
import Page from "@/components/common/Page";
import Row from "@/components/common/Row";
import {
  fetchAllProducts,
  fetchTotalProductCount,
} from "@/services/productServices";
import ProductList from "@/components/shop/ProductList";
import NumberedPagination from "@/components/common/NumberedPagination";
import ShopPageReset from "@/components/shop/ShopPageReset";

const ShopPageContent = async () => {
  // Fetching the first 12 products
  const productsResponse = await fetchAllProducts(12, null);
  const initialProducts = productsResponse.items;
  const initialCursor = productsResponse.endCursor;
  const totalProducts = await fetchTotalProductCount(); // Fetch total product count

  return (
    <>
      <Head>
        <title>Next Page ShopPageContent</title>
        <meta name="description" content="This is the demo page" />
      </Head>
      <Page className={""} FULL={false}>
        <Row className="prose max-w-3xl mx-auto">
          <h1 className="text-center">The Shop</h1>
        </Row>
        <div className="bg-white">
          <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-8 lg:max-w-7xl lg:px-1">
            <div className="md:flex md:items-center md:justify-between">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Trending products
              </h2>
              <a
                href="#"
                className="hidden text-sm font-medium text-indigo-600 hover:text-indigo-500 md:block"
              >
                Ask a question...
                <span aria-hidden="true"> &rarr;</span>
              </a>
            </div>

            {/* Reset Zustand pagination on client-side */}
            <ShopPageReset
              initialProducts={initialProducts}
              initialCursor={initialCursor}
            />

            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 md:gap-y-0 lg:gap-x-8">
              <ProductList
                initialProducts={initialProducts}
                totalProducts={totalProducts}
                initialCursor={initialCursor}
              />
            </div>
            <NumberedPagination />
          </div>
        </div>
      </Page>
    </>
  );
};

export default ShopPageContent;
