import Image from "next/image";
import Link from "next/link";

export default async function CountryPage({ params }) {
  const raw = await params;
  const slugParam = raw.slug;

  const countrySlug = slugParam.toLowerCase();
  const countryName = countrySlug.replace(/-/g, " ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/country?country=${countrySlug}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  const products = data?.products || [];
  const categories = data?.categories || [];
  const subcategories = data?.subcategories || [];

  return (
    <div className="container mx-auto px-4 py-8">

      <h1 className="text-2xl font-bold mb-4 capitalize">
        Products from {countryName}
      </h1>

      {/* 🔥 Show Categories */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {categories.map(cat => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 Show Subcategories */}
      {subcategories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Subcategories</h2>
          <div className="flex flex-wrap gap-3">
            {subcategories.map(sub => (
              <Link
                key={sub._id}
                href={`/subcategory/${sub.slug}`}
                className="px-4 py-2 bg-blue-100 rounded-lg hover:bg-blue-200"
              >
                {sub.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 🔥 Product Grid */}
      {products.length === 0 ? (
        <p className="text-gray-600">No matching products found</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {products.map((item) => (
            <Link
              key={item._id}
              href={`/${countrySlug}/${item.productslug}`}
              className="block border p-3 rounded-lg hover:shadow-md"
            >
            
              <Image
                src={item.images?.[0]?.url || "/no-image.png"}
                alt={item.name}
                width={500}
                height={500}
                className="rounded-lg object-cover h-40 w-full"
              />

              <h2 className="mt-2 text-lg font-semibold">{item.name}</h2>
              <p className="text-gray-500 text-sm">Price: ₹{item.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

