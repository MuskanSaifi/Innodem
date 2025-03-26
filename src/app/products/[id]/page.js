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
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
      >
        ← Back
      </button>

      {loading ? (
        <Skeleton count={5} height={30} />
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section - Product Image */}
          <div>
            {product.images?.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={500}
                height={500}
                className="w-full h-auto object-cover rounded-lg"
                unoptimized
              />
            ) : (
              <Image
                src="/placeholder.png"
                alt="Placeholder"
                width={500}
                height={500}
                className="w-full h-auto object-cover rounded-lg"
                unoptimized
              />
            )}

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="mt-4 flex gap-2">
                {product.images.slice(1).map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index}`}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-md border"
                    unoptimized
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Section - Product Details */}
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
            <p className="text-gray-600 text-lg mt-2">
              <strong>Supplier:</strong> {product.userId?.fullname || "Unknown"} | <strong>Company:</strong>{" "}
              {product.userId?.companyName || "Unknown"}
            </p>

            {/* Pricing Section */}
            <div className="mt-4">
              <h3 className="text-xl font-semibold">Pricing</h3>
              <p className="text-2xl font-bold text-green-600">
                ₹{product.tradeShopping?.slabPricing?.[0]?.price || "N/A"}
              </p>
              <p className="text-gray-700">MOQ: {product.minimumOrderQuantity || "N/A"}</p>
            </div>

            {/* Product Details */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <p className="text-gray-600">{product.description || "No description available."}</p>
            </div>

            {/* Specifications */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Specifications</h3>
              <ul className="text-gray-700 space-y-1">
                <li>Color: {product.specifications?.color || "N/A"}</li>
                <li>Material: {product.specifications?.material || "N/A"}</li>
                <li>Weight: {product.specifications?.weight || "N/A"} kg</li>
                <li>Stock: {product.stock !== null ? product.stock : "Not Available"}</li>
              </ul>
            </div>

            {/* Trade Information */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Trade Information</h3>
              <ul className="text-gray-700 space-y-1">
                <li>Supply Ability: {product.tradeInformation?.supplyAbility || "N/A"}</li>
                <li>Delivery Time: {product.tradeInformation?.deliveryTime || "N/A"}</li>
                <li>FOB Port: {product.tradeInformation?.fobPort || "N/A"}</li>
                <li>Sample Policy: {product.tradeInformation?.samplePolicy || "N/A"}</li>
              </ul>
            </div>

            {/* Seller Details */}
            <div className="mt-4 border-t pt-4">
              <h3 className="text-lg font-semibold">Seller Details</h3>
              <p className="text-gray-700">
                <strong>Company:</strong> {product.userId?.companyName || "Unknown"}
              </p>
              <p className="text-gray-700">
                <strong>Location:</strong> {product.userId?.location || "Unknown"}
              </p>
              <p className="text-gray-700">
                <strong>Rating:</strong> ⭐⭐⭐⭐
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
                Buy Now
              </button>
              <button className="px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition">
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>No product details found.</p>
      )}
    </div>
  );
};

export default ProductDetailPage;
