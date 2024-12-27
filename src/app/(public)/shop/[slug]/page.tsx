import { notFound } from "next/navigation";
import {
  fetchAllProductSlugs,
  fetchProductBySlug,
} from "@/services/productServices";

// Generate static params for SSG
export async function generateStaticParams() {
  try {
    const slugs = await fetchAllProductSlugs();
    console.log("Fetched product slugs:", slugs);
    return slugs.map((slug: string) => ({ slug }));
  } catch (error) {
    console.error("Error fetching product slugs:", error);
    return [];
  }
}

// Single product page component
const SingleProduct = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  try {
    const product = await fetchProductBySlug(slug);
    console.log("Fetched product data:", product); // Log for testing purposes

    // TESTING THE GEN PARAM FUNC
    const slugs = await fetchAllProductSlugs();
    console.log("Fetched product slugs:", slugs);

    // Handle 404 with ISR
    if (!product) {
      notFound();
    }

    return <div>Product Data Loaded</div>; // Placeholder for testing
  } catch (error) {
    console.error("Error fetching product data:", error);
    notFound();
  }
};

export default SingleProduct;
