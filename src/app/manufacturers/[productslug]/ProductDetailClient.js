"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useParams } from "next/navigation";
import BuySellForm from "./BuySellform";
import Buyfrom from "./Buyfrom";
import BuySell from "@/components/BuySell";

const ProductDetailClient = ({ productslug: propProductSlug }) => {
  const params = useParams();
  const slugFromURL = params?.productslug || propProductSlug;
  const [product, setProduct] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
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
        const response = await fetch(`/api/manufacturers/${encodedSlug}`);
        if (!response.ok) throw new Error(`Failed to fetch product data: ${response.status}`);
        const data = await response.json();

        setProduct(data.product || null);
        setSubcategories(data.subcategories || []);
        setRelatedProducts(data.relatedProducts || []);
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
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Subcategories
            </h5>
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
                    <li className="list-group-item hover:bg-gray-100">{sub.name}</li>
                  </Link>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No subcategories available.</p>
            )}
          </div>
        </aside>

        {/* Product Details */}
        <div className="col-md-6 mb-4">
          {loading ? (
            <Skeleton height={400} />
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : product ? (
            <div className="card p-4 common-shad border-0 rounded">
          <Image
  src={product?.images?.[0]?.url || "/placeholder.png"}
  alt={product?.name || "Product Image"}
  width={400}
  height={400}
  className="rounded-md object-cover mx-auto block"
  onError={(e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = "/placeholder.png";
  }}
/>

              <h2 className="mt-3 text-primary">{product.name}</h2>
              <p className="text-secondary">
                <strong>Price:</strong> ₹{product.price} {product.currency || "INR"}
              </p>
              <p><strong>MOQ:</strong> {product.minimumOrderQuantity || "N/A"}</p>
              <p>{product.description}</p>
              <Link
                href={`/products/${product._id}`}
                className="btn btn-outline-primary btn-sm mt-2 w-100"
              >
                More details
              </Link>
<Buyfrom product={product} sellerId={product?.userId} />

            </div>
          ) : (
            <p className="text-warning">Product details not available.</p>
          )}
        </div>

        {/* Related Products (Desktop Only) */}
        <aside className="col-md-3 mb-4 d-none d-md-block">
  <div className="bg-white p-3 rounded common-shad sticky top-20">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Related Products
            </h5>
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
                    <li className="list-group-item hover:bg-gray-100">{prod.name}</li>
                  </Link>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No related products available.</p>
            )}
{product && <BuySell initialProductName={product.name} />}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetailClient;
