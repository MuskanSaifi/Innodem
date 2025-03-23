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
    <div className="container mx-auto p-6">
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
        <div className="border p-6 rounded-lg shadow-lg bg-white">
          {/* Supplier Info */}
          <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-lg text-gray-600 mt-2">
            <strong>Supplier:</strong> {product.userId?.fullname || "Unknown"} | <strong>Company:</strong>{" "}
            {product.userId?.companyName || "Unknown"}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {/* Product Images */}
            <div>
              {product.images?.length > 0 ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={400}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
                  unoptimized
                />
              ) : (
                <Image
                  src="/placeholder.png"
                  alt="Placeholder"
                  width={400}
                  height={400}
                  className="w-full h-96 object-cover rounded-lg"
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

            {/* Product Details */}
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">Product Details</h3>
              <p className="text-gray-600 mt-2">{product.description || "No description available."}</p>

              {/* Pricing */}
              <h3 className="text-lg font-semibold mt-4">Pricing</h3>
              <p className="text-xl font-semibold text-green-600">
                Price: ₹{product.tradeShopping?.slabPricing?.[0]?.price || "N/A"} {product.currency || "INR"}
              </p>
              <p className="text-gray-700">MOQ: {product.minimumOrderQuantity || "N/A"}</p>

              {/* Specifications */}
              <h3 className="text-lg font-semibold mt-4">Specifications</h3>
              <p className="text-gray-700">Color: {product.specifications?.color || "N/A"}</p>
              <p className="text-gray-700">Material: {product.specifications?.material || "N/A"}</p>
              <p className="text-gray-700">
                Weight: {product.specifications?.weight || "N/A"} {product.specifications?.weightUnit || "kg"}
              </p>
              <p className="text-gray-700">Stock: {product.stock !== null ? product.stock : "Not Available"}</p>

              {/* Trade Information */}
              <h3 className="text-lg font-semibold mt-4">Trade Information</h3>
              <p className="text-gray-700">Supply Ability: {product.tradeInformation?.supplyAbility || "N/A"}</p>
              <p className="text-gray-700">Delivery Time: {product.tradeInformation?.deliveryTime || "N/A"}</p>
              <p className="text-gray-700">FOB Port: {product.tradeInformation?.fobPort || "N/A"}</p>
              <p className="text-gray-700">Sample Policy: {product.tradeInformation?.samplePolicy || "N/A"}</p>
              <p className="text-gray-700">Certifications: {product.tradeInformation?.certifications || "N/A"}</p>

              {/* Trade Shopping */}
              <h3 className="text-lg font-semibold mt-4">Shipping & Return Policy</h3>
              <p className="text-gray-700">Shipping Type: {product.tradeShopping?.shippingType || "N/A"}</p>
              <p className="text-gray-700">GST: {product.tradeShopping?.gst || "N/A"}%</p>
              <p className="text-gray-700">Returnable: {product.tradeShopping?.isReturnable || "N/A"}</p>

              {/* Buy Button */}
              <button className="mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition">
                Buy Now
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
