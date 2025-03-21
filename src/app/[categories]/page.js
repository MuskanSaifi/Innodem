"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryPage = () => {
  const { categories: encodedCategory } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to correctly format category names from the URL
  const formatCategoryName = (name) => {
    return decodeURIComponent(name)
      .replace(/-/g, " ") // Replace hyphens with spaces
      .replace(/and/g, "&") // Convert "and" back to "&" if used
      .trim()
      .toLowerCase();
  };

  useEffect(() => {
    if (!encodedCategory) return;

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all categories
        const response = await fetch(`/api/adminprofile/category`);
        if (!response.ok) throw new Error("Failed to fetch category data");

        const categories = await response.json();
        const formattedCategory = formatCategoryName(encodedCategory);

        // Find the matched category
        const category = categories.find(
          (cat) => cat.name.trim().toLowerCase() === formattedCategory
        );

        if (!category) throw new Error("Category not found");

        setSubcategories(category.subcategories || []);

        // Extract products from subcategories and attach subcategory reference
        const allProducts =
          category.subcategories?.flatMap((sub) =>
            (sub.products || []).map((product) => ({
              ...product,
              subcategory: sub.name, // Add subcategory name reference
            }))
          ) || [];

        setProducts(allProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [encodedCategory]);

  return (
    <div className="container mt-2">
      <div className="row">
        {/* Sidebar with Subcategories */}
        <div className="col-md-3">
          <h5>Subcategories</h5>
          {loading ? (
            <Skeleton count={5} height={20} />
          ) : (
            <ul className="list-group">
              {subcategories.map((sub) => (
                <li key={sub._id} className="list-group-item">
                  <Link href={`/${encodedCategory}/${encodeURIComponent(sub.name.replace(/&/g, "and").replace(/ /g, "-"))}`}>
                    {sub.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Main Content - Product List */}
        <div className="col-md-9">
          <h4>{formatCategoryName(encodedCategory)} Products</h4>
          <p>({loading ? <Skeleton width={30} /> : products.length})</p>
          <div className="row">
            {loading ? (
              <Skeleton count={6} height={150} />
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="col-md-4 mb-4">
                  <div className="card p-3">
                    <Image
                      src={product.images?.[0]?.url || "/placeholder.jpg"}
                      alt={product.name}
                      width={200}
                      height={200}
                      className="rounded product-image"
                      style={{ objectFit: "cover", borderRadius: "5px" }}
                      priority={false}
                    />
                    <h5 className="mt-2 text-primary">{product.name}</h5>
                    <p>₹{product.price} {product.currency || "INR"}</p>
                    <Link href={`/${encodedCategory}/${encodeURIComponent(product.subcategory.replace(/&/g, "and").replace(/ /g, "-"))}/${product._id}`}>
                      More details...
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found for this category.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
