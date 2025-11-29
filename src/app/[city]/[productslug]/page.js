import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import ProductListClient from "./ProductListClient";

export async function generateMetadata({ params: rawParams }) {
  const params = await rawParams;
  const { city, productslug } = params;

  await connectdb();

  const product = await Product.findOne({ productslug })
    .populate("userId")
    .lean();

  const formattedCity = city.replace(/-/g, " ");
  const formattedProduct = productslug.replace(/-/g, " ");

  const title = product
    ? `${product.name} in ${formattedCity} | ${product?.userId?.companyName || "Top Supplier"}`
    : `Best ${formattedProduct} in ${formattedCity} | Manufacturers & Suppliers`;

  const description = product
    ? `Buy ${product.name} in ${formattedCity} at wholesale prices. Contact ${product?.userId?.companyName}.`
    : `Find top manufacturers & wholesalers of ${formattedProduct} in ${formattedCity}.`;

  const keywords = product
    ? [
        product.name,
        `${product.name} in ${formattedCity}`,
        `${product.name} price`,
        `${product.name} manufacturers`,
        product?.userId?.companyName || "Top Supplier",
        formattedCity,
      ]
    : [
        formattedProduct,
        `${formattedProduct} in ${formattedCity}`,
        `${formattedProduct} suppliers`,
        `${formattedProduct} manufacturers`,
        formattedCity,
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `https://www.dialexportmart.com/${city}/${productslug}`,
    },
    openGraph: {
      title,
      description,
      images: product?.images?.length
        ? [{ url: product.images[0].url }]
        : [{ url: "/default-product.jpg" }],
      url: `https://www.dialexportmart.com/${city}/${productslug}`,
      type: "article",
      locale: "en_IN",
      siteName: "Dial Export Mart",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product?.images?.length
        ? [{ url: product.images[0].url }]
        : [{ url: "/default-product.jpg" }],
    },
  };
}

export default async function Page({ params: rawParams }) {
  const params = await rawParams;
  const { city, productslug } = params;

  await connectdb();
  const products = await Product.find({ productslug }).lean();

  return (
    <ProductListClient
      city={city}
      productslug={productslug}
      initialProducts={JSON.parse(JSON.stringify(products))}
    />
  );
}
