// app/products/[id]/ProductPage
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Buyfrom from "./Buyfrom";
import Link from "next/link";

const ProductDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [relatedCategories, setRelatedCategories] = useState([]);
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
        setRelatedProducts(data.relatedProducts || []);
        setRelatedCategories(data.relatedCategories || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
      setHoveredImage(null);
    }
  }, [id]);

  useEffect(() => {
    if (product && product.images && product.images.length > 0 && !hoveredImage) {
      setHoveredImage(product.images[0]);
    }
  }, [product, hoveredImage]);


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
        <div className="mb-6 bg-blue-50 rounded-md p-3 inline-block w-full">
          <button
            onClick={() => router.back()}
            className="text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md px-4 py-2 transition-colors duration-200"
          >
            ← Back to Products
          </button>
        </div>

        <div className="bg-white rounded-3xl  grid md:grid-cols-12 gap-8 p-6">
          {loading ? (
            <>
              <div className="md:col-span-6">
                <Skeleton height={400} className="rounded-2xl" />
                <div className="flex mt-4 space-x-3">
                  <Skeleton circle width={80} height={80} />
                  <Skeleton circle width={80} height={80} />
                  <Skeleton circle width={80} height={80} />
                </div>
              </div>
              <div className="md:col-span-6 space-y-4">
                <Skeleton height={30} width="80%" />
                <Skeleton count={2} width="60%" />
                <Skeleton height={20} width="40%" />
                <Skeleton height={50} width="70%" />
                <Skeleton count={5} />
                <Skeleton height={150} />
                <Skeleton height={150} />
                <Skeleton height={40} width="50%" />
              </div>
            </>
          ) : error ? (
            <p className="text-red-600 md:col-span-12 text-center">{error}</p>
          ) : product ? (
            <>
              {/* Thumbnails and Main Image Container - Made sticky */}
              <div className="md:col-span-6 md:sticky md:top-10 h-min flex flex-col md:flex-row gap-4">
                {/* Thumbnails */}
                <div className="md:w-1/6 space-y-3 hidden md:block">
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
                <div className="md:w-5/6">
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
              </div>

              {/* Product Info - This will scroll */}
              <div className="md:col-span-6 space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                  <div className="text-gray-500 text-sm mt-1 space-x-2">
                    {product.userId?.fullname && <span>👤 {product.userId.fullname}</span>}
                    {product.userId?.companyName && <span>🏢 {product.userId.companyName}</span>}
                  </div>
                  <p className="text-yellow-500 text-sm font-semibold">⭐⭐⭐⭐ Rating</p>

                  <div className="mt-4 flex items-center space-x-6">
                    <div className="bg-green-100 bg-opacity-40 text-green-700 text-4xl font-extrabold px-6 py-3 rounded-lg ">
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

                  <div className="mt-6 border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Specifications Table */}
                    <div>
                      <h2 className="font-semibold text-lg mb-4">Specifications</h2>
                      <table className="w-full text-sm text-left text-gray-700 border rounded overflow-hidden">
                        <tbody>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Color</td>
                            <td className="py-2 px-3">{product.specifications?.color || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Material</td>
                            <td className="py-2 px-3">{product.specifications?.material || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Weight</td>
                            <td className="py-2 px-3">{product.specifications?.weight || "N/A"} kg</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Stock</td>
                            <td className="py-2 px-3">{product.stock ?? "Not Available"}</td>
                          </tr>
                          {/* Add more specifications based on your schema if needed */}
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Product Type</td>
                            <td className="py-2 px-3">{product.specifications?.productType || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Finish</td>
                            <td className="py-2 px-3">{product.specifications?.finish || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Design</td>
                            <td className="py-2 px-3">{product.specifications?.design || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Usage</td>
                            <td className="py-2 px-3">{product.specifications?.usage || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Application</td>
                            <td className="py-2 px-3">{product.specifications?.application || "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Trade Info Table */}
                    <div>
                      <h2 className="font-semibold text-lg mb-4">Trade Info</h2>
                      <table className="w-full text-sm text-left text-gray-700 border rounded overflow-hidden">
                        <tbody>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Supply Ability</td>
                            <td className="py-2 px-3">{product.tradeInformation?.supplyAbility || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Delivery Time</td>
                            <td className="py-2 px-3">{product.tradeInformation?.deliveryTime || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">FOB Port</td>
                            <td className="py-2 px-3">{product.tradeInformation?.fobPort || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Sample Policy</td>
                            <td className="py-2 px-3">{product.tradeInformation?.samplePolicy || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Sample Available</td>
                            <td className="py-2 px-3">{product.tradeInformation?.sampleAvailable || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Payment Terms</td>
                            <td className="py-2 px-3">{product.tradeInformation?.paymentTerms || "N/A"}</td>
                          </tr>
                          <tr className="even:bg-gray-50">
                            <td className="py-2 px-3 font-medium text-gray-600">Packaging Details</td>
                            <td className="py-2 px-3">{product.tradeInformation?.packagingDetails || "N/A"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {product.businessProfile && (
                    <div className="mt-6 border-t pt-4">
                      <h2 className="font-semibold text-lg mb-4 text-gray-900 text-xl">Business Profile</h2>

                      {product.businessProfile.companyDescription && (
                        <div
                          className="mb-6 text-sm text-gray-600"
                          dangerouslySetInnerHTML={{ __html: product.businessProfile.companyDescription }}
                        />
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Business Type */}
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-100 p-3 rounded-full">
                            🛍️
                          </div>
                          <div>
                            <p className="text-gray-700 font-semibold mb-0">Business Type</p>
                            <p className="text-gray-500 text-sm">{product.businessProfile.businessType?.join(", ") || "N/A"}</p>
                          </div>
                        </div>

                        {/* Employee Count */}
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-100 p-3 rounded-full">
                            👥
                          </div>
                          <div>
                            <p className="text-gray-700 font-semibold mb-0">Employee Count</p>
                            <p className="text-gray-500 text-sm">{product.businessProfile.numberOfEmployees || "N/A"}</p>
                          </div>
                        </div>

                        {/* Establishment */}
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-100 p-3 rounded-full">
                            🎖️
                          </div>
                          <div>
                            <p className="text-gray-700 font-semibold mb-0">Establishment</p>
                            <p className="text-gray-500 text-sm">{product.businessProfile.yearOfEstablishment || "N/A"}</p>
                          </div>
                        </div>

                        {/* GST Number */}
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-100 p-3 rounded-full">
                            ✅
                          </div>
                          <div>
                            <p className="text-gray-700 font-semibold mb-0">GST NO</p>
                            <p className="text-gray-500 text-sm">{product.businessProfile.gstNumber || "N/A"}</p>
                          </div>
                        </div>

                        {/* Payment Mode (using samplePolicy as a placeholder based on previous context) */}
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-100 p-3 rounded-full">
                            💳
                          </div>
                          <div>
                            <p className="text-gray-700 font-semibold mb-0">Payment Mode</p>
                            <p className="text-gray-500 text-sm">
                              {product.tradeInformation?.samplePolicy || "N/A"}
                            </p>
                          </div>
                        </div>

                        {/* Working Days */}
                        <div className="flex items-start space-x-4">
                          <div className="bg-orange-100 p-3 rounded-full">
                            📅
                          </div>
                          <div>
                            <p className="text-gray-700 font-semibold mb-0">Working Days</p>
                            <p className="text-gray-500 text-sm">
                              {product.businessProfile.workingDays?.join(" To ") || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Logo */}
                      {product.businessProfile.companyLogo && (
                        <div className="mt-6">
                          <Image
                            src={product.businessProfile.companyLogo}
                            alt="Company Logo"
                            width={120}
                            height={120}
                            className="rounded border "
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-6 border-t">
                  <Buyfrom product={product} sellerId={product?.userId?._id} />
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
            <p className="md:col-span-12 text-center">No product found.</p>
          )}
        </div>

        {/* --- Related Products Section --- */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 bg-white rounded-3xl  p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct._id} href={`/products/${relatedProduct._id}`} className="block">
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white flex flex-col h-full">
                    <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center p-2">
                      <Image
                        src={relatedProduct.images?.[0] || "/placeholder.png"}
                        alt={relatedProduct.name}
                        width={200}
                        height={150}
                        className="object-contain max-h-full max-w-full"
                        unoptimized
                      />
                      <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        +{relatedProduct.images?.length || 0}
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="text-blue-600 font-bold text-xl mb-2">
                          {relatedProduct.tradeShopping?.slabPricing?.[0]?.price ?
                            `₹${relatedProduct.tradeShopping.slabPricing[0].price}` : "Ask Price"
                          }
                        </div>
                        <div className="text-sm text-gray-700 space-y-1">
                          {relatedProduct.specifications?.usage && (
                            <p><span className="font-medium text-gray-600">Usage:</span> {relatedProduct.specifications.usage}</p>
                          )}
                          {relatedProduct.specifications?.woodType && (
                            <p><span className="font-medium text-gray-600">Wood Type:</span> {relatedProduct.specifications.woodType}</p>
                          )}
                          {relatedProduct.specifications?.design && (
                            <p><span className="font-medium text-gray-600">Design:</span> {relatedProduct.specifications.design}</p>
                          )}
                          {relatedProduct.specifications?.finish && (
                            <p><span className="font-medium text-gray-600">Finish:</span> {relatedProduct.specifications.finish}</p>
                          )}
                          {relatedProduct.tradeInformation?.mainExportMarkets?.length > 0 && (
                            <p><span className="font-medium text-gray-600">Export Markets:</span> {relatedProduct.tradeInformation.mainExportMarkets.join(', ')}</p>
                          )}
                          {relatedProduct.tradeInformation?.mainDomesticMarket && (
                            <p><span className="font-medium text-gray-600">Domestic Market:</span> {relatedProduct.tradeInformation.mainDomesticMarket}</p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100">
                        {(relatedProduct.userId?.companyName || relatedProduct.userId?.fullname) && (
                          <p className="text-gray-800 font-semibold text-base">
                            {relatedProduct.userId?.companyName || relatedProduct.userId?.fullname}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          {relatedProduct.businessProfile?.gstNumber && (
                            <span className="flex items-center text-green-700 text-sm font-medium bg-green-50 px-2 py-1 rounded-full">
                              ✅ GST
                            </span>
                          )}
                          {relatedProduct.businessProfile?.yearOfEstablishment && (
                            <span className="flex items-center text-gray-600 text-sm font-medium bg-gray-100 px-2 py-1 rounded-full">
                              👤 {new Date().getFullYear() - relatedProduct.businessProfile.yearOfEstablishment} yrs
                            </span>
                          )}
                        </div>
                        <p className="text-yellow-500 text-sm font-semibold mt-2">
                          ⭐⭐⭐⭐ 4.2 (79)
                        </p>
                        <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors duration-200 font-medium">
                          Contact Supplier
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* --- Related Categories Section --- */}
        {relatedCategories.length > 0 && (
          <div className="mt-12 bg-white rounded-3xl  p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More in Similar Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {relatedCategories.map((rc) => (
                <Link
                  key={rc._id}
                  // Link logic: if type is product_as_category_display, link to product, else link to category
                  href={rc.type === 'product_as_category_display' ? `/manufacturers/${rc.slug}` : `/seller/${rc.slug}`}
                  className="block"
                >
                  <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white text-center flex flex-col items-center p-3 h-full">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-3 overflow-hidden">
                      <Image
                        src={rc.image || "/placeholder.png"} // Use rc.image as it's passed from API (which is icon or product image)
                        alt={rc.name}
                        width={96}
                        height={96}
                        className="object-cover rounded-full w-full h-full"
                        unoptimized
                      />
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                      {rc.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDetailPage;