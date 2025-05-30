"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/adminprofile/category");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 font-semibold mt-4">
        ⚠️ {error}
      </div>
    );
  }

  return (
<div className="py-10 px-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
  <div className="container mx-auto">
    <h2 className="text-3xl font-bold mb-8 text-center text-purple-700 drop-shadow-sm">
      Browse Categories
    </h2>

    {categories.length === 0 ? (
      <p className="text-center text-gray-500">No categories available.</p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 ease-in-out"
          >
            {/* Clickable Category Title */}
            <h3
              className="text-xl font-semibold text-indigo-600 hover:underline cursor-pointer mb-3"
              onClick={() => router.push(`/seller/${category.categoryslug}`)}
              role="button"
              tabIndex={0}
            >
              {category.name}
            </h3>

            {/* Subcategories as colored tags */}
            {category.subcategories && category.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {category.subcategories.map((sub) => (
                  <span
                    key={sub._id}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent category click
                      router.push(
                        `/seller/${category.categoryslug}/${sub.subcategoryslug}`
                      );
                    }}
                    className="inline-block bg-indigo-100 text-indigo-700 text-sm font-medium px-3 py-1 rounded-full cursor-pointer hover:bg-indigo-200 transition"
                  >
                    {sub.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
}
