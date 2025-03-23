"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductDetailPage = () => {
  const {
    categories: encodedCategory,
    "sub-categories": encodedSubcategory,
    productname: encodedProductName,
  } = useParams();

  const [product, setProduct] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatName = (name) => {
    return decodeURIComponent(name)
      .replace(/-/g, " ")
      .replace(/and/g, "&")
      .trim();
  };

  useEffect(() => {
    if (!encodedCategory || !encodedSubcategory || !encodedProductName) return;

    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/adminprofile/category`);
        if (!response.ok) throw new Error("Failed to fetch category data");

        const categories = await response.json();
        const formattedCategory = formatName(encodedCategory).toLowerCase();
        const category = categories.find(
          (cat) => cat.name.trim().toLowerCase() === formattedCategory
        );

        if (!category) throw new Error("Category not found");

        setSubcategories(category.subcategories || []); // Store all subcategories

        const formattedSubcategory =
          formatName(encodedSubcategory).toLowerCase();
        const subcategory = category.subcategories.find(
          (sub) => sub.name.trim().toLowerCase() === formattedSubcategory
        );

        if (!subcategory) throw new Error("Subcategory not found");

        const formattedProductName =
          formatName(encodedProductName).toLowerCase();
        const matchedProduct = subcategory.products.find(
          (prod) => prod.name.trim().toLowerCase() === formattedProductName
        );

        if (!matchedProduct) throw new Error("Product not found");
        setProduct(matchedProduct);

        setSuggestedProducts(subcategory.products.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [encodedCategory, encodedSubcategory, encodedProductName]);

  return (
    <div className="container mt-4">
      <nav className="breadcrumb">
        <Link href="/">Home</Link> /
        <Link href={`/${encodedCategory}`}>
          {loading ? <Skeleton width={100} /> : formatName(encodedCategory)}
        </Link>{" "}
        /
        <Link href={`/${encodedCategory}/${encodedSubcategory}`}>
          {loading ? <Skeleton width={100} /> : formatName(encodedSubcategory)}
        </Link>{" "}
        /{loading ? <Skeleton width={100} /> : formatName(encodedProductName)}
      </nav>

      <div className="row">
        <aside className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm">
            <h5 className="mb-3 text-primary">Subcategories</h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : (
              <ul className="list-group">
                {subcategories.map((sub) => {
                  const isActive =
                    formatName(sub.name) === formatName(encodedSubcategory);
                  return (
                    <li
                      key={sub._id}
                      className={`list-group-item ${
                        isActive
                          ? "active text-white bg-primary fw-bold"
                          : "text-dark"
                      }`}
                    >
                      <Link
                        href={`/${encodedCategory}/${encodeURIComponent(
                          sub.name.replace(/&/g, "and").replace(/ /g, "-")
                        )}`}
                        className="text-decoration-none"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        <div className="col-md-6">
          {loading ? (
            <Skeleton height={400} />
          ) : error ? (
            <p className="text-danger">{error}</p>
          ) : product ? (
            <div className="card p-4 shadow-lg border-0 rounded">
              <Image
                src={product.images?.[0]?.url || "/placeholder.png"}
                alt={product.name}
                width={400}
                height={400}
                className="rounded img-fluid"
                style={{ objectFit: "cover" }}
              />
              <h2 className="mt-3 text-primary">{product.name}</h2>
              <p className="text-secondary">
                <strong>Price:</strong> ₹{product.price}{" "}
                {product.currency || "INR"}
              </p>
              <p>
                <strong>MOQ:</strong> {product.minimumOrderQuantity || "N/A"}
              </p>
              <p>{product.description}</p>
              <p>
                <Link
                  href={`/products/${product._id}`}
                  className="btn btn-outline-primary btn-sm mt-2 w-100"
                >
                  More details
                </Link>
              </p>
            </div>
          ) : (
            <p className="text-warning">Product details not available.</p>
          )}
        </div>

        <aside className="col-md-3">
          <div className="bg-white p-3 rounded shadow-sm">
            <h5 className="mb-3 text-primary">Suggested Products</h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : (
              <ul className="list-group">
                {suggestedProducts.map((prod) => (
                  <li key={prod._id} className="list-group-item">
                    <Link
                      href={`/${encodedCategory}/${encodedSubcategory}/${encodeURIComponent(
                        prod.name.replace(/ /g, "-")
                      )}`}
                      className="text-info"
                    >
                      {prod.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProductDetailPage;
