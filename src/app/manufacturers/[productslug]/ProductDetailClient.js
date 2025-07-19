"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "next/navigation";
import BuySellForm from "./BuySellform"; // Assuming these are correctly imported and used
import Buyfrom from "./Buyfrom"; // Assuming these are correctly imported and used
import BuySell from "@/components/BuySell"; // Assuming these are correctly imported and used

const ProductDetailClient = ({ productslug: propProductSlug }) => {
  const params = useParams();
  const slugFromURL = params?.productslug || propProductSlug;
  // Change from 'product' to 'products' (array)
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
    const [businessProfile, setBusinessProfile] = useState(null); // ✅ Added

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showRelatedDropdown, setShowRelatedDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);

  useEffect(() => {
    if (!slugFromURL) return;

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      try {
        const encodedSlug = encodeURIComponent(slugFromURL);
        // Ensure the API path is correct
        const response = await fetch(`/api/manufacturers/${encodedSlug}`);
        if (!response.ok)
          throw new Error(`Failed to fetch product data: ${response.status}`);
        const data = await response.json();

        // Set ALL products returned by the API
        setProducts(data.products || []);
        setSubcategories(data.subcategories || []);
        setRelatedProducts(data.relatedProducts || []);
                setBusinessProfile(data.businessProfile || null); // ✅ Added
      } catch (err) {
        console.error("Error fetching product:", err?.message || err);
        setError("Could not load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [slugFromURL]);

  return (
    <div className="container mt-4 mb-5">
      <nav className="breadcrumb bg-light p-3 rounded text-sm">
        <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
        {loading ? <Skeleton width={100} /> : slugFromURL}
      </nav>

      {/* Mobile Dropdowns */}
      <div className="d-md-none mb-4">
        {/* Subcategories Dropdown */}
        <div className="mb-3">
          <button
            className="btn btn-sm btn-primary w-100 text-start"
            onClick={() => setShowSubcategoryDropdown(!showSubcategoryDropdown)}
          >
            Subcategories
          </button>
          {showSubcategoryDropdown && (
            <ul className="list-group mt-1">
              {subcategories.length > 0 ? (
                subcategories.map((sub) => (
                  <Link
                    key={sub._id}
                    href={`/seller/${sub?.category?.categoryslug}/${sub?.subcategoryslug}`}
                    className="text-decoration-none"
                  >
                    <li className="list-group-item">{sub.name}</li>
                  </Link>
                ))
              ) : (
                <li className="list-group-item text-muted">No subcategories.</li>
              )}
            </ul>
          )}
        </div>

        {/* Related Products Dropdown */}
        <div>
          <button
            className="btn btn-sm btn-success w-100 text-start"
            onClick={() => setShowRelatedDropdown(!showRelatedDropdown)}
          >
            Related Products
          </button>
          {showRelatedDropdown && (
            <ul className="list-group mt-1">
              {relatedProducts.length > 0 ? (
                relatedProducts.map((prod) => (
                  <Link
                    key={prod._id}
                    href={`/manufacturers/${prod.productslug}`}
                    className="text-decoration-none"
                  >
                    <li className="list-group-item">{prod.name}</li>
                  </Link>
                ))
              ) : (
                <li className="list-group-item text-muted">No related products.</li>
              )}
            </ul>
          )}
        </div>
      </div>

      <div className="row">
        {/* Subcategories (Desktop Only) */}
        <aside className="col-md-3 mb-4 d-none d-md-block">
          <div className="bg-white p-3 rounded common-shad sticky top-20">
            <div className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Subcategories
            </div>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : subcategories.length > 0 ? (
              <ul className="list-group">
                {subcategories.map((sub) => (
                  <Link
                    key={sub._id}
                    href={`/seller/${sub?.category?.categoryslug}/${sub?.subcategoryslug}`}
                    className="text-decoration-none"
                  >
                    <li className="list-group-item hover:bg-gray-100">
                      {sub.name}
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No subcategories available.</p>
            )}
          </div>
        </aside>

        {/* Product Details - Iterate over 'products' */}
<div className="col-md-6 mb-4">
  {loading ? (
    <Skeleton height={400} />
  ) : error ? (
    <p className="text-danger">{error}</p>
  ) : products.length > 0 ? (
    products.map((product) => (
      <div key={product._id} className="card shadow-sm border-0 mb-3 rounded-4 overflow-hidden">
        <div className="row g-0">
          {/* Product Image */}
          <div className="col-12 col-md-4 bg-light d-flex align-items-center justify-content-center p-2">
            <Image
              src={product?.images?.[0]?.url || "/placeholder.png"}
              alt={product?.name || "Product Image"}
              width={150}
              height={150}
              className="img-fluid rounded"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = "/placeholder.png";
              }}
            />
          </div>

          {/* Product Details */}
          <div className="col-12 col-md-8 p-3">
            <h5 className="text-primary fw-bold mb-2">{product.name}</h5>

            <div className="d-flex flex-wrap justify-content-between mb-2">
              <p className="mb-0"><strong>Price:</strong> ₹{product.price} {product.currency || "INR"}</p>
              <p className="mb-0"><strong>MOQ:</strong> {product.minimumOrderQuantity} {product.moqUnit || "Number"}</p>
            </div>

       
            {/* Short Description */}
            {product.description && (
              <p className="text-muted small mb-2">
                {product.description.length > 120
                  ? `${product.description.slice(0, 120)}...`
                  : product.description}
              </p>
            )}

      {/* ✅ Business Profile Info */}
                    {businessProfile && (
                      <div className="border-top pt-3 mt-3 small">
                        {/* <h6 className="text-dark fw-bold mb-2">Business Details</h6> */}
                        <p className="mb-1"><strong>Company Name:</strong> {businessProfile.companyName}</p>
                        <p className="mb-1"><strong>GST Number:</strong> {businessProfile.gstNumber}</p>
                        <p className="mb-1"><strong>Year Established:</strong> {businessProfile.yearOfEstablishment}</p>
                      </div>
                    )}

            {/* GST / Selling Price / Returnable */}
            {product?.tradeShopping && (
              <div className="mb-2">
                <p className="mb-0 small"><strong>GST:</strong> {product.tradeShopping.gst}%</p>
                <p className="mb-0 small"><strong>Selling Price Type:</strong> {product.tradeShopping.sellingPriceType}</p>
                <p className="mb-0 small"><strong>Returnable:</strong> {product.tradeShopping.isReturnable}</p>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-3">
            <Link
  href={`/products/${product._id}`}
  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-500 rounded hover:bg-blue-50 transition"
>
  More Details
</Link>

              <Buyfrom product={product} sellerId={product?.userId} />
            </div>
          </div>


        </div>
      </div>
    ))
  ) : (
    <p className="text-warning">Product details not available.</p>
  )}
</div>

        {/* Related Products (Desktop Only) */}
        <aside className="col-md-3 mb-4 d-none d-md-block">
          <div className="bg-white p-3 rounded common-shad sticky top-20">
            <div className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Related Products
            </div>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : relatedProducts.length > 0 ? (
              <ul className="list-group">
                {relatedProducts.map((prod) => (
                  <Link
                    key={prod._id}
                    href={`/manufacturers/${prod.productslug}`}
                    className="text-web text-decoration-none"
                  >
                    <li className="list-group-item hover:bg-gray-100">
                      {prod.name}
                    </li>
                  </Link>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No related products available.</p>
            )}
            {/* If there are multiple products, you might need to decide which one's name to pass
                to BuySell. For now, it passes the name of the first product in the list. */}
            {products.length > 0 && (
              <BuySell initialProductName={products[0].name} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetailClient;