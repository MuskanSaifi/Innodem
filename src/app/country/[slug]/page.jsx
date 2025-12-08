// app/country/[slug]/page.jsx

import Link from "next/link";

export default async function CountryPage({ params }) {
  const { slug } = await params;

  const countrySlug = slug.toLowerCase();
  const countryName = countrySlug.replace(/-/g, " ");

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/country?country=${countrySlug}`,
    { cache: "no-store" }
  );

  const data = await res.json();
  const categories = data?.categories || [];
  const subcategories = data?.subcategories || [];

  // 🟢 Build map for instant access (5X faster)
  const groupedSubcats = {};
  subcategories.forEach((s) => {
    if (!groupedSubcats[s.category]) groupedSubcats[s.category] = [];
    groupedSubcats[s.category].push(s);
  });

  return (
    <div className="container mx-auto px-4 py-10">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Explore The Best Of{" "}
          <span className="text-orange-500 capitalize">{countryName}</span>
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Manufacturers & Suppliers from {countryName}
        </p>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => {
          const subs = groupedSubcats[cat._id] || [];

          return (
            <div key={cat._id} className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-lg transition-all">
              
              {/* Category Header */}
              <div className="flex items-center justify-between mb-4">
                <Link
                  href={`/country/${countrySlug}/${cat.categoryslug}`}
                  className="text-xl font-semibold text-gray-800 hover:text-orange-500 transition"
                >
                  {cat.name}
                </Link>

                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-orange-500 text-2xl">📦</span>
                </div>
              </div>

              {/* Subcategories */}
              <ul className="space-y-2 mt-4">
                {subs.length > 0 ? (
                  subs.map((sub) => (
                    <li key={sub._id}>
                      <Link
                        href={`/subcategory/${sub.subcategoryslug}`}
                        className="flex items-center text-gray-700 hover:text-orange-500"
                      >
                        <span className="mr-2">→</span> {sub.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No subcategories available</p>
                )}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
