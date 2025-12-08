// app/country/[slug]/[category]/page.jsx
import Link from "next/link";

export default async function CategoryCountryPage({ params }) {

  // 🔥 Required fix — params must be awaited!
  const { slug: country, category } = await params;


  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/country/category-country?country=${country}&category=${category}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  const categoryData = data?.category || null;
  const subcategories = data?.subcategories || [];

  if (!categoryData)
    return <div className="p-10 text-center text-gray-500">Category not found</div>;

return (
  <div className="container mx-auto px-4 py-10">

    {/* Header Section */}
    <div className="text-center mb-12">
      <h1 className="text-4xl font-extrabold text-gray-800 capitalize">
        {categoryData.name} from{" "}
        <span className="text-orange-500">{country.toUpperCase()}</span>
      </h1>
      <p className="text-gray-600 mt-2 text-lg">
        Explore top subcategories under {categoryData.name}
      </p>
    </div>

    {/* Subcategory Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {subcategories.map((sub) => (
        <Link
          key={sub._id}
          href={`/country/${country}/${category}/${sub.subcategoryslug}`}
          className="group block border rounded-xl bg-white shadow-sm hover:shadow-xl transition-all duration-300"
        >
          {/* Image Section */}
          <div className="h-40 w-full overflow-hidden rounded-t-xl bg-gray-100">
            <img
              src={
                sub.icon ||
                "https://via.placeholder.com/300x200.png?text=No+Image"
              }
              alt={sub.name}
              className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Content Section */}
          <div className="p-5">
            <h2 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600 transition">
              {sub.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              View Products →
            </p>
          </div>
        </Link>
      ))}

      {subcategories.length === 0 && (
        <p className="text-gray-400 text-center col-span-full">No subcategories found.</p>
      )}
    </div>
  </div>
);

}
