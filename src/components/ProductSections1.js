"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import {Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  <section className="mt-5">
      <div className="container-fluid" style={{ marginTop: 30, marginBottom: 30 }}>
      <h2 className="text-2xl font-extrabold text-gray-800 text-center mb-4">
        {Name} Products
      </h2>

      {loading && <Skeleton count={5} height={150} />}
      {error && <p className="text-red-600 text-center">{error}</p>}
      {!loading && !error && products.length === 0 && (
        <p className="text-center text-gray-500">No products found.</p>
      )}

      {/* Swiper component for responsive product display */}
      <Swiper
        modules={[Pagination, Autoplay]}

        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        spaceBetween={20}
        slidesPerView={2}  // Default: 1 product per slide
        breakpoints={{
          640: {
            slidesPerView: 2, // 2 products per slide for mobile
          },
          768: {
            slidesPerView: 4, // 3 products per slide for tablet
          },
          1024: {
            slidesPerView: 6, // 4 products per slide for larger screens
          },
          2000: {
            slidesPerView: 8, // 4 products per slide for larger screens
          },
        }}
      >
        {products.map((product) => {
          // const categoryName = product.category?.name || "unknown";
          // const subCategoryName = product.subCategory?.name || "general";
          // const productName = formatUrl(product.name);

          return (
            <SwiperSlide key={product._id}>
              <Link
                // href={`/seller/${formatUrl(categoryName)}/${formatUrl(subCategoryName)}/${productName}`}
                href={`/manufacturers/${product.productslug}`}
                className="group"
              >
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
                {product.name.replace(/\b\w/g, c => c.toUpperCase())}
                </p>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  </section>
  );
};

export default ProductSections1;
