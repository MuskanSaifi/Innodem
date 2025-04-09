import ProductDetailClient from "./ProductDetailClient";

export async function generateMetadata({ params }) {
  console.log("✅ generateMetadata called for:", params.productname);

  if (!params?.productname) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for could not be found.",
    };
  }

  const decodedName = decodeURIComponent(params.productname)
    .replace(/-+$/, "")
    .replace(/-+/g, " ")
    .trim();

  const apiName = encodeURIComponent(decodedName.toLowerCase());

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/manufacturers/${apiName}`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Product not found");

    const data = await res.json();
    const product = data.product;

    const {
      name,
      city,
      state,
      country,
      specifications = {},
      tradeShopping = {},
      metaTitle,
      metaDescription,
      metaKeywords,
    } = product;

    const location = [city, state, country].filter(Boolean).join(", ");
    const brand = tradeShopping.brandName || "";
    const application = specifications.application || specifications.usage || "";
    const feature = specifications.feature || "";
    const material = specifications.material || "";
    const finish = specifications.finish || "";
    const color = specifications.color || "";

    const getOptimizedTitle = () => {
      const baseTitle = name || "Product";
      const locationPart = location ? ` in ${location}` : "";
      const brandPart = brand ? ` by ${brand}` : "";
      return `${baseTitle}${brandPart}${locationPart} - Best Price & Deals`;
    };

    const generateMetaDescription = () => {
      const templates = [
        `${name} is one of the best options available${location ? ` in ${location}` : ""}. Discover its features, specifications, and best pricing here.`,
        `Looking for ${name}? Find premium quality${brand ? ` by ${brand}` : ""}${location ? ` in ${location}` : ""}. Check out its details and prices now.`,
        `Get top deals on ${name}${brand ? ` from ${brand}` : ""}${location ? ` in ${location}` : ""}. Ideal for ${application}. Explore more!`,
        `${name} is known for its ${feature}${material ? ` and durable ${material}` : ""}. Available at the best price online!`,
        `Buy ${name}${brand ? ` by ${brand}` : ""}${location ? ` in ${location}` : ""}. Featuring ${feature}, ${finish} finish, and ${color} color.`,
      ];
      return templates[0];
    };

    return {
      title: metaTitle || getOptimizedTitle(),
      description: metaDescription || generateMetaDescription(),
      keywords: metaKeywords || name?.split(" ")?.join(", "),
    };
  } catch (err) {
    return {
      title: "Product Not Found",
      description: "The product you're looking for could not be found.",
    };
  }
}

export default function ProductDetailPage({ params }) {
  return <ProductDetailClient productname={params.productname} />;
}
