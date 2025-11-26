import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import Link from "next/link";

// ✅ Dynamic SEO
export async function generateMetadata({ params }) {
  const city = params.city;

  return {
    title: `Business Directory of ${city} | Top Manufacturers & Suppliers`,
    description: `Find top verified manufacturers, wholesalers, and suppliers in ${city}. Explore business listings across all categories.`,
  };
}

// ✅ Page Component
export default async function CityPage({ params }) {
  const city = params.city;

  await connectdb();

  // 🔥 Aggregation to remove duplicate products by name
  let products = await Product.aggregate([
    {
      $match: {
        city: { $regex: `^${city}$`, $options: "i" },
      },
    },
    {
      $group: {
        _id: "$name",
        doc: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$doc" },
    },
  ]);

  // Populate category & subcategory
  await Product.populate(products, [
    { path: "category" },
    { path: "subCategory" },
  ]);

  // Group products by category
  const categories = {};
  products.forEach((p) => {
    const cat = p.category?.name || "Other";
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(p);
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        Business Directory of {city}
      </h1>

      {Object.entries(categories).map(([catName, catProducts], idx) => (
        <div key={idx} className="mb-10">
          {/* Category Name */}
          <h2 className="text-xl font-bold mb-4 border-l-4 pl-2 border-blue-600">
            {catName}
          </h2>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {catProducts.slice(0, 8).map((product) => (
              <Link
                key={product._id}
                href={`/${city}/${encodeURIComponent(product.name.toLowerCase())}`}
              >
                <div className="border rounded shadow-sm p-3 hover:shadow-lg transition cursor-pointer">
                  <img
                    src={product.images?.[0]?.url || "/default-image.jpg"}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded"
                  />
                  <p className="font-medium mt-2">{product.name}</p>
                  <p className="text-sm text-gray-600">₹{product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
