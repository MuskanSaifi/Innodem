"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

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

export default function ProductListClient({ city, productslug, initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(!initialProducts?.length);

  useEffect(() => {
    if (initialProducts?.length > 0) return;

    const loadProducts = async () => {
      setLoading(true);

      const r = await fetch(
        `/api/city/products?city=${city}&productslug=${productslug}`
      );

      const data = await r.json();
      setProducts(data);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const pageTitle =
    products.length > 0
      ? products[0].name
      : productslug.replace(/-/g, " ");

  return (
    <div className="container mx-auto p-4 md:p-6">
      <style>{arrowStyles}</style>

      <h1 className="text-2xl md:text-3xl font-bold mb-6 capitalize">
        {pageTitle} in {city}
      </h1>

      {loading && (
        <p className="text-center text-lg text-blue-600">Loading Products...</p>
      )}

      {!loading && products.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <strong className="font-bold">No Match Found!</strong>
          <span className="ml-2">
            Sorry, no products matching "{pageTitle}" found in {city}.
          </span>
        </div>
      )}

      {/* GRID: 2 ON MOBILE | 4 ON DESKTOP */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {!loading &&
          products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
      </div>
    </div>
  );
}

/* ------------------------------------------
   PRODUCT CARD (OLD UI RESTORED)
------------------------------------------ */
function ProductCard({ product }) {
  const images =
    product.images?.length > 0
      ? product.images
      : [{ url: "/default-product.jpg" }];

  const displayPrice = product.price
    ? `₹${product.price.toLocaleString("en-IN")}`
    : "Price on Request";

  const unit = product.moqUnit || "Piece";

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-xl transition p-0 overflow-hidden relative">

      {/* Supplier Ribbon */}
      <span className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] px-2 py-1 rounded-br-lg rounded-tl-lg z-10">
        Leading Supplier
      </span>

      {/* IMAGE SLIDER */}
      <Swiper modules={[Navigation]} navigation spaceBetween={10}>
        {images.map((img, i) => (
          <SwiperSlide key={i}>
            <Image
              src={img.url}
              width={600}
              height={300}
              className="w-full h-64 object-cover"
              alt={product.name}
              unoptimized
              loading="lazy"
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* PRODUCT INFO */}
      <div className="p-3">

        <h2 className="font-semibold text-sm md:text-base leading-tight capitalize line-clamp-2">
          {product.name}
        </h2>

        {/* PRICE */}
        <p className="text-lg font-bold mt-1 text-red-600">
          {displayPrice}
          <span className="text-xs text-gray-600"> / {unit}</span>
        </p>

        {/* MOQ */}
        {product.minimumOrderQuantity > 0 && (
          <p className="text-xs text-gray-700 mt-1">
            MOQ: {product.minimumOrderQuantity} {unit}
          </p>
        )}

        {/* CITY */}
        <p className="text-xs text-gray-600 mt-1 flex items-center">
          📍 {product.city}, {product.state}
        </p>

        {/* SPECIFICATIONS */}
        <div className="mt-2 text-xs text-gray-700 space-y-1">
          {product?.specifications?.material && (
            <p><b>Material:</b> {product.specifications.material}</p>
          )}
          {product?.specifications?.finish && (
            <p><b>Finish:</b> {product.specifications.finish}</p>
          )}
        </div>

        {/* SUPPLIER NAME */}
        <div className="mt-3 pt-2 text-xs border-t font-medium text-gray-800">
          {product?.userId?.companyName || "Verified Supplier"}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex gap-2 mt-3">
          <button className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold px-3 py-2 rounded w-full">
            Contact Supplier
          </button>

          <button className="border border-green-600 text-green-600 hover:bg-green-50 text-xs font-semibold px-3 py-2 rounded w-full">
            View Mobile
          </button>
        </div>

      </div>
    </div>
  );
}
