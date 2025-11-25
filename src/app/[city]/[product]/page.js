"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

// CUSTOM ARROW STYLES
const arrowStyles = `
.swiper-button-prev,
.swiper-button-next {
  color: #000;
  background: #fff;
  width: 40px;
  height: 40px;
  border-radius: 999px;
  box-shadow: 0px 3px 10px rgba(0,0,0,0.2);
}
.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 16px;
}
`;

export default function ProductListByName() {
  const { city, product } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city || !product) return;

    const fetchProducts = async () => {
      try {
        const r = await fetch(
          `/api/city/products?city=${city}&product=${product}`
        );
        const data = await r.json();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [city, product]);

  return (
    <div className="container mx-auto p-4 md:p-6">

      {/* Inject Swiper Arrow CSS */}
      <style>{arrowStyles}</style>

      {/* Page Title */}
      <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize">
        {product} in {city}
      </h1>

      {loading && <p>Loading...</p>}
      {!loading && products.length === 0 && (
        <p className="text-red-600 font-semibold">
          No products found in {city}
        </p>
      )}

      {/* GRID: 2 ON MOBILE | 4 ON DESKTOP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------
   PRODUCT CARD
------------------------------------------ */
function ProductCard({ product }) {
  const images =
    product.images && product.images.length > 0
      ? product.images
      : [{ url: "/default.jpg" }];

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition p-0 overflow-hidden relative">

      {/* Supplier Ribbon */}
      <span className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-br-lg rounded-tl-lg z-10">
        Leading Supplier
      </span>

      {/* PRODUCT IMAGES */}
      <Swiper
        modules={[Navigation]}
        navigation
        spaceBetween={10}
        className="rounded-t-xl"
      >
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <Image
              src={img.url}
              width={600}
              height={300}
              alt={product.name}
              className="w-full h-64 object-cover"
              unoptimized
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* INFORMATION */}
      <div className="p-3">
        <h2 className="font-semibold text-sm md:text-base leading-tight capitalize line-clamp-2">
          {product.name}
        </h2>

        {/* PRICE */}
        <p className="text-lg font-bold mt-1">
          ₹{product.price}
          <span className="text-xs text-gray-600"> / Piece</span>
        </p>

        {/* CITY */}
        <p className="text-xs text-gray-600 mt-1 flex items-center">
          <span>📍 {product.city}</span>
        </p>

        {/* SPECIFICATIONS */}
        <div className="mt-2 text-xs text-gray-700 space-y-1">
          {product?.specifications?.material && (
            <p>
              <b>Fabric:</b> {product.specifications.material}
            </p>
          )}
          {product?.specifications?.design && (
            <p>
              <b>Design:</b> {product.specifications.design}
            </p>
          )}
        </div>

        {/* SUPPLIER NAME */}
        <div className="mt-3 pt-2 text-xs border-t font-medium text-gray-800">
          {product?.userId?.companyName || "Supplier Name"}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 mt-3">

          {/* CONTACT BUTTON */}
          <button className="bg-green-600 hover:bg-green-700 text-white text-xs md:text-sm font-semibold px-3 py-2 rounded w-full">
            Contact Supplier
          </button>

          {/* MOBILE BUTTON */}
          <button className="border border-green-600 text-green-600 hover:bg-green-50 text-xs md:text-sm font-semibold px-3 py-2 rounded w-full">
            View Mobile
          </button>
        </div>
      </div>
    </div>
  );
}
