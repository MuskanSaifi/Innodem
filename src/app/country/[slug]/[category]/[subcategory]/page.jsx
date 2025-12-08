// app/country/[slug]/[category]/[subcategory]/page.jsx
import Image from "next/image";
import Link from "next/link";

export default async function SubCategoryProductsPage({ params }) {

  const { slug: country, category, subcategory } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/country/subcategory-country?country=${country}&category=${category}&subcategory=${subcategory}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  const products = data?.products || [];
  const subCatData = data?.subcategory || null;

  if (!subCatData)
    return <div className="p-10 text-center text-gray-400">Subcategory not found</div>;

  return (
    <div className="container mx-auto px-4 py-10">

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 capitalize">
          {subCatData.name} in {country.toUpperCase()}
        </h1>
        <p className="text-gray-500 mt-2">Explore top products under this subcategory</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/product/${product.productslug}`}
            className="group block border rounded-xl bg-white shadow hover:shadow-lg transition"
          >
            <div className="h-48 overflow-hidden rounded-t-xl bg-gray-100">
              <img
src={product.images?.[0]?.url || "/no-image.png"}
                alt={product.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform"
              />
            </div>

            <div className="p-4">
              <h2 className="font-semibold text-gray-800 group-hover:text-orange-600 transition">
                {product.name}
              </h2>
              <p className="text-gray-500 text-sm mt-1">View Details →</p>
            </div>
          </Link>
        ))}

        {products.length === 0 && (
          <p className="text-gray-400 text-center col-span-full">No products found.</p>
        )}
      </div>
    </div>
  );
}
