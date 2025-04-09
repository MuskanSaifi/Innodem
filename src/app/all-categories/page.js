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

  function formatUrl(name) {
    return encodeURIComponent(name.replace(/&/g, "and").replace(/ /g, "-").toLowerCase());
  }

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
    <div className="p-6 container mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Categories</h2>
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="bg-white p-4 shadow-md rounded-xl border hover:shadow-lg transition cursor-pointer focus:ring-2 focus:ring-blue-400"
            >
              {/* Clickable Category */}
              <h3
                className="text-lg font-semibold text-blue-600 hover:underline"
                onClick={() => router.push(`/seller/${formatUrl(category.name)}`)}
                role="button"
                tabIndex={0}
              >
                {category.name}
              </h3>

              {/* Subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-md font-semibold text-gray-800">Subcategories:</h4>
                  <ul className="list-disc list-inside text-gray-700">
                    {category.subcategories.map((sub) => (
                      <li
                        key={sub._id}
                        className="text-sm text-blue-500 hover:underline cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent category click
                          router.push(`/seller/${formatUrl(category.name)}/${formatUrl(sub.name)}`);
                        }}
                      >
                        {sub.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
