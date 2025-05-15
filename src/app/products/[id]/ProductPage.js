"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [showZoomModal, setShowZoomModal] = useState(false);
  const modalRef = useRef();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Error fetching product.");
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleZoomOpen = () => setShowZoomModal(true);
  const handleZoomClose = () => setShowZoomModal(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        handleZoomClose();
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") handleZoomClose();
    };
    if (showZoomModal) {
      window.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleEsc);
    };
  }, [showZoomModal]);

  return (
    <section className="min-h-screen bg-white py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


<div className="mb-6 bg-blue-50 rounded-md p-3 inline-block w-100">
  <button
    onClick={() => router.back()}
    className="text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md px-4 py-2 transition-colors duration-200"
  >
    ← Back to Products
  </button>
</div>




        <div className="bg-white rounded-3xl shadow-xl grid md:grid-cols-12 gap-8 p-6">
          {loading ? (
            <Skeleton count={10} height={20} />
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : product ? (
            <>
              {/* Thumbnails */}
              <div className="md:col-span-2 space-y-3 hidden md:block">
                {product.images?.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    width={100}
                    height={80}
                    className={`rounded-xl border object-cover cursor-pointer transition-all duration-300 ${
                      hoveredImage === img ? "ring-2 ring-blue-500" : ""
                    }`}
                    onMouseEnter={() => setHoveredImage(img)}
                    unoptimized
                  />
                ))}
              </div>

              {/* Main Image */}
              <div className="md:col-span-5">
                <div
                  className="relative overflow-hidden border rounded-2xl w-full cursor-zoom-in"
                  onClick={handleZoomOpen}
                >
                  <Image
                    src={hoveredImage || product.images?.[0] || "/placeholder.png"}
                    alt={product.name || "Product Image"}
                    width={500}
                    height={500}
                    className="object-cover w-full h-auto"
                    unoptimized
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="md:col-span-5 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="text-gray-500 text-sm mt-1 space-x-2">
                    {product.userId?.fullname && <span>👤 {product.userId.fullname}</span>}
                    {product.userId?.companyName && <span>🏢 {product.userId.companyName}</span>}
                  </div>
                    <p className="text-yellow-500 text-sm font-semibold">⭐⭐⭐⭐ Rating</p>

<div className="mt-4 flex items-center space-x-6">
  <div className="bg-green-100 bg-opacity-40 text-green-700 text-4xl font-extrabold px-6 py-3 rounded-lg shadow-sm">
    ₹{product.tradeShopping?.slabPricing?.[0]?.price || "N/A"}
  </div>
  <div className="text-gray-700 font-medium text-lg">
    MOQ: <span className="font-bold text-gray-900">{product.minimumOrderQuantity || "N/A"}</span>
  </div>
</div>

                  <div className="mt-6 border-t pt-4">
                    <h2 className="font-semibold text-lg mb-2">Description</h2>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {product.description || "No description available."}
                    </p>
                  </div>

             <div className="mt-6 border-t pt-4 flex flex-col md:flex-row md:space-x-8">
  <div className="flex-1 mb-6 md:mb-0">
    <h2 className="font-semibold text-lg mb-2">Specifications</h2>
    <ul className="text-sm text-gray-700 space-y-1">
      <li>🟠 Color: {product.specifications?.color || "N/A"}</li>
      <li>🔧 Material: {product.specifications?.material || "N/A"}</li>
      <li>⚖️ Weight: {product.specifications?.weight || "N/A"} kg</li>
      <li>📦 Stock: {product.stock ?? "Not Available"}</li>
    </ul>
  </div>

  <div className="flex-1">
    <h2 className="font-semibold text-lg mb-2">Trade Info</h2>
    <ul className="text-sm text-gray-700 space-y-1">
      <li>🚛 Supply: {product.tradeInformation?.supplyAbility || "N/A"}</li>
      <li>⏱ Delivery: {product.tradeInformation?.deliveryTime || "N/A"}</li>
      <li>🚢 FOB Port: {product.tradeInformation?.fobPort || "N/A"}</li>
      <li>📄 Sample: {product.tradeInformation?.samplePolicy || "N/A"}</li>
    </ul>
  </div>
</div>

                  {/* <div className="mt-6 border-t pt-4">
                    <h2 className="font-semibold text-lg mb-2">Seller Info</h2>
                    <p className="text-sm text-gray-700">
                      <strong>Company:</strong> {product.userId?.companyName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-700">
                      <strong>Location:</strong> {product.city || "Unknown"}
                    </p>
                  </div> */}
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <button className="flex-1 py-3 px-5 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700">
                    Buy Now
                  </button>
                  <button className="flex-1 py-3 px-5 bg-gray-800 text-white font-semibold rounded-xl shadow hover:bg-gray-900">
                    Send Inquiry
                  </button>
                </div>
              </div>

              {/* Zoom Modal */}
              {showZoomModal && (
                <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
                  <div
                    ref={modalRef}
                    className="relative w-full max-w-5xl h-[80vh] bg-white rounded-xl overflow-hidden cursor-zoom-out"
                    onMouseMove={handleMouseMove}
                    onClick={handleZoomClose}
                  >
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage: `url(${hoveredImage || product.images?.[0]})`,
                        backgroundSize: "200%",
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                    <button
                      className="absolute top-2 right-2 text-white bg-black rounded-full p-2 text-xl"
                      onClick={handleZoomClose}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>No product found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
