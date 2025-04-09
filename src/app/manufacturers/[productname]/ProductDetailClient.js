"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductDetailClient = ({ productname }) => {
  const encodedProductName = productname;

  const [product, setProduct] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatName = useCallback((name) => {
    if (!name) return "";
    return decodeURIComponent(name)
      .replace(/-+$/, "")
      .replace(/-+/g, " ")
      .trim();
  }, []);


  const createSlug = (str) => {
    return encodeURIComponent(
      str
        .toLowerCase()
        .replace(/&/g, "and")        // Replace & with and
        .replace(/\s+/g, "-")        // Replace spaces with hyphens
        .replace(/[^a-z0-9-]/g, "")  // Remove unwanted characters
        .trim()
    );
  };

  
  useEffect(() => {
    if (!encodedProductName) return;

    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      try {
        const formattedProductName = formatName(encodedProductName);
        const apiName = encodeURIComponent(formattedProductName.toLowerCase());

        const response = await fetch(`/api/manufacturers/${apiName}`);

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
  }, [encodedProductName, formatName]);

  return (
    <div className="container mt-4 mb-5">
      <nav className="breadcrumb bg-light p-3 rounded text-sm">
        <Link href="/">Home</Link> / <Link href="/products">Products</Link> /{" "}
        {loading ? <Skeleton width={100} /> : formatName(encodedProductName)}
      </nav>

      <div className="row">
        {/* Subcategories */}
        <aside className="col-md-3 mb-4">
          <div className="bg-white p-3 rounded common-shad">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Subcategories
            </h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : subcategories.length > 0 ? (
              <ul className="list-group">
       {subcategories.map((sub) => {
  const categorySlug = createSlug(sub?.category?.name || "");
  const subcategorySlug = createSlug(sub?.name || "");

  return (
    <Link
      key={sub._id}
      href={`/seller/${categorySlug}/${subcategorySlug}`}
      className="text-decoration-none"
    >
      <li className="list-group-item hover:bg-gray-100">{sub.name}</li>
    </Link>
  );
})}

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
                className="rounded img-fluid m-auto"
                style={{ objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.png";
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
            </div>
          ) : (
            <p className="text-warning">Product details not available.</p>
          )}
        </div>

        {/* Related Products */}
        <aside className="col-md-3 mb-4">
          <div className="bg-white p-3 rounded common-shad">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Related Products
            </h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : relatedProducts.length > 0 ? (
              <ul className="list-group">
                {relatedProducts.map((prod) => {
                  const productSlug = encodeURIComponent(
                    prod.name.replace(/\s+/g, "-").toLowerCase()
                  );

                  return (
                    <Link
                      key={prod._id}
                      href={`/manufacturers/${productSlug}`}
                      className="text-web text-decoration-none"
                    >
                      <li className="list-group-item hover:bg-gray-100">{prod.name}</li>
                    </Link>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted">No related products available.</p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetailClient;
