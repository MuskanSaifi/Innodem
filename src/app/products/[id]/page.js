"use client";

import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch product.");
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  return (
    <section className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <button
          onClick={() => router.back()}
          className="mb-6 text-sm font-medium text-blue-600 hover:underline"
        >
          ← Back to Products
        </button>

        <div className="bg-white rounded-xl shadow-xl p-8">
          {loading ? (
            <Skeleton count={10} height={20} />
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : product ? (
            <div className="grid md:grid-cols-2 gap-10">
              {/* Product Image Section */}
              <div>
                <Image
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  width={600}
                  height={600}
                  className="rounded-lg object-cover w-full"
                  unoptimized
                />

                {/* Thumbnails */}
                {product.images?.length > 1 && (
                  <div className="mt-4 flex gap-3">
                    {product.images.slice(1).map((img, index) => (
                      <Image
                        key={index}
                        src={img}
                        alt={`Thumbnail ${index}`}
                        width={80}
                        height={80}
                        className="rounded-md border object-cover"
                        unoptimized
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Section */}
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>

                <div className="text-sm text-gray-500 mb-4">
  {product.userId?.fullname && (
    <span className="mr-2">👤 {product.userId.fullname || "Unknown"}</span>
  )}
  {product.userId?.companyName && (
    <span>🏢 {product.userId.companyName || "Unknown"}</span>
  )}
</div>


                <p className="text-4xl font-extrabold text-green-600 mb-2">
                  ₹{product.tradeShopping?.slabPricing?.[0]?.price || "N/A"}
                </p>
                <p className="text-gray-700 mb-6 text-sm">
                  MOQ: <strong>{product.minimumOrderQuantity || "N/A"}</strong>
                </p>

                <hr className="my-6" />

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Product Description</h2>
                  <p className="text-gray-700 leading-relaxed">{product.description || "No description available."}</p>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Specifications</h2>
                  <ul className="text-gray-600 space-y-1">
                    <li>🟠 Color: {product.specifications?.color || "N/A"}</li>
                    <li>🔧 Material: {product.specifications?.material || "N/A"}</li>
                    <li>⚖️ Weight: {product.specifications?.weight || "N/A"} kg</li>
                    <li>📦 Stock: {product.stock ?? "Not Available"}</li>
                  </ul>
                </div>

                {/* Trade Information */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Trade Information</h2>
                  <ul className="text-gray-600 space-y-1">
                    <li>🚛 Supply Ability: {product.tradeInformation?.supplyAbility || "N/A"}</li>
                    <li>⏱ Delivery Time: {product.tradeInformation?.deliveryTime || "N/A"}</li>
                    <li>🚢 FOB Port: {product.tradeInformation?.fobPort || "N/A"}</li>
                    <li>📄 Sample Policy: {product.tradeInformation?.samplePolicy || "N/A"}</li>
                  </ul>
                </div>

                {/* Seller Details */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Seller Details</h2>
                  <p className="text-gray-600">
                    <strong>Company:</strong> {product.userId?.companyName || "Unknown"}
                  </p>
                  <p className="text-gray-600">
                    <strong>Location:</strong> {product.city || "Unknown"}
                  </p>
                  <p className="text-yellow-500">
                    <strong>Rating:</strong> ⭐⭐⭐⭐
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all">
                    Buy Now
                  </button>
                  <button className="px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold shadow-md hover:bg-gray-900 transition-all">
                    Send Inquiry
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p>No product details found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetailPage;
