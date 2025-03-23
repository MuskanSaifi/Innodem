"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";

const ProductSections1 = ({ tag, Name }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/adminprofile/seller");
        const data = await response.json();
        if (!response.ok) throw new Error("Failed to fetch products");

        // ✅ Filter products by tag
        const filteredProducts = data.filter((product) => product.tags?.[tag] === true);
        setProducts(filteredProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [tag]);

  // ✅ Format URL function
  function formatUrl(name) {
    return encodeURIComponent(name.replace(/&/g, "and").replace(/\s+/g, "-").toLowerCase());
  }

  return (
    <div className="container mx-auto px-4" style={{ marginTop: 70, marginBottom: 70 }}>
      <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-12">
        {Name} Products
      </h2>

      {loading && <Skeleton count={5} height={150} />}
      {error && <p className="text-red-600 text-center">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">No products found.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {products.map((product) => {
          const categoryName = product.category?.name || "unknown";
          const subCategoryName = product.subCategory?.name || "general";
          const productName = formatUrl(product.name);

          return (
            <Link key={product._id} href={`/${formatUrl(categoryName)}/${formatUrl(subCategoryName)}/${productName}`} className="group">
              <div className="relative w-28 h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 mx-auto rounded-full overflow-hidden bg-white border border-gray-200 shadow-md backdrop-blur-md transition-all duration-300 group-hover:shadow-2xl">
                <Image
                  src={product.images?.[0]?.url || "/placeholder.png"}
                  alt={product.name}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-3"
                />
              </div>
              <p className="mt-3 text-center text-gray-700 font-medium text-sm group-hover:text-gray-900 transition-all">
                {product.name}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ProductSections1;
