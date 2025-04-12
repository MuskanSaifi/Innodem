"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick").then((mod) => mod.default), { ssr: false });

const ProductSections2 = ({ tag, Name }) => {
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

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  return (
    <div className="container mx-auto  bg-white rounded-lg mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">{Name} Products</h2>
        <Link href={`/seller/category/${formatUrl(tag)}`} className="text-blue-500 hover:underline text-sm">
          View All
        </Link>
      </div>

      {loading && <Skeleton count={5} height={150} />}
      {error && <p className="text-red-600 text-center">{error}</p>}
      {!loading && !error && products.length === 0 && <p className="text-center text-gray-500">No products found.</p>}

      <Slider {...settings}>
        {products.map((product) => {
          const categoryName = product.category?.name || "unknown";
          const subCategoryName = product.subCategory?.name || "general";
          const productName = formatUrl(product.name);

          return (
            <div key={product._id} className="p-1">
              <div className="border rounded-lg shadow-sm p-3 hover:shadow-lg transition-all bg-white">
                <Link href={`/seller/${formatUrl(categoryName)}/${formatUrl(subCategoryName)}/${productName}`}>
                  <div className="relative w-full h-40 mb-3 overflow-hidden rounded">
                    <Image
                      src={product.images?.[0]?.url || "/placeholder.png"}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform transform hover:scale-105"
                    />
                  </div>
                </Link>
                <p className="text-gray-600 text-xs text-center mb-1">{product.seller || "Unknown Seller"}</p>
                <h3 className="text-gray-800 font-semibold text-sm truncate text-center mb-1">{product.name}</h3>
                <p className="text-blue-500 font-bold text-md text-center">₹{product.price}/Pieces</p>
                <Link href={`/seller/${formatUrl(categoryName)}/${formatUrl(subCategoryName)}/${productName}`} className="block text-center border rounded-lg py-2 mt-3 text-blue-600 border-blue-500 hover:bg-blue-500 hover:text-white transition">
                  Buy Now
                </Link>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

const SampleNextArrow = ({ onClick }) => (
  <div className="absolute top-1/2 -right-5 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 cursor-pointer hover:bg-gray-200" onClick={onClick}>
    ➜
  </div>
);

const SamplePrevArrow = ({ onClick }) => (
  <div className="absolute top-1/2 -left-5 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-2 cursor-pointer hover:bg-gray-200" onClick={onClick}>
    ➜
  </div>
);

export default ProductSections2;
