"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryPage = () => {
  const { categories: encodedCategory } = useParams();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatCategoryName = (name) =>
    decodeURIComponent(name)
      .replace(/-/g, " ")
      .replace(/and/g, "&")
      .trim()
      .toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/adminprofile/category");
        if (!response.ok) throw new Error("Failed to fetch category data");

        const data = await response.json();
        setCategories(data);

        if (!encodedCategory) return;

        const formattedCategory = formatCategoryName(encodedCategory);
        const category = data.find(
          (cat) => cat.name.trim().toLowerCase() === formattedCategory
        );

        if (!category) throw new Error("Category not found");

        setSubcategories(category.subcategories || []);

        const allProducts =
          category.subcategories?.flatMap((sub) =>
            (sub.products || []).map((product) => ({
              ...product,
              subcategory: sub.name,
            }))
          ) || [];

        setProducts(allProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [encodedCategory]);

  return (
    <div className="container mt-4 mb-5">
      {/* Breadcrumb */}
      <nav className="breadcrumb bg-light p-3 rounded">
        <span className="text-secondary">Home / {formatCategoryName(encodedCategory)}</span>
      </nav>

      <div className="row mt-4">
        {/* Left Sidebar: All Categories */}
        <aside className="col-md-3">
          <div className="bg-white p-3 rounded common-shad">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">All Categories</h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : (
              <ul className="list-group">
                {categories.map((cat) => {
                  const isActive = formatCategoryName(cat.name) === formatCategoryName(encodedCategory);
                  return (
                    <Link
                    key={cat._id} // ✅ Move key here
                    href={`/${encodeURIComponent(cat.name.replace(/&/g, "and").replace(/ /g, "-"))}`}
                    className="text-decoration-none"
                  >
                    <li className={`list-group-item hover:bg-gray-100 ${isActive ? "active text-white bg-purple fw-bold" : "text-dark"}`}>
                      {cat.name}
                    </li>
                  </Link>
                  
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Main Content: Products */}
        <main className="col-md-6 common-shad rounded-2 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-uppercase text-secondary">{formatCategoryName(encodedCategory)} Products</h4>
            <span className="badge bg-primary text-white fs-6">{loading ? <Skeleton width={30} /> : products.length}</span>
          </div>

          <div className="row g-4">
            {loading ? (
              <Skeleton count={6} height={150} />
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="col-md-6">
                  <div className="card border-0 shadow-sm p-3 rounded-3">
                    <div className="position-relative text-center">
                      <Image
                        src={product.images?.[0]?.url || "placeholder.png"}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="rounded img-fluid m-auto"
                        style={{ objectFit: "cover" }}
                        priority={false}
                      />
                    </div>
                    <h6 className="mt-2 text-primary text-center">{product.name}</h6>
                    <table className="table table-sm mt-2">
                      <tbody>
                        <tr>
                          <th>Price</th>
                          <td>₹{product.price} {product.currency || "INR"}</td>
                        </tr>
                        <tr>
                          <th>MOQ</th>
                          <td>{product.minimumOrderQuantity || "N/A"}</td>
                        </tr>
                        <tr>
                          <th>Subcategory</th>
                          <td>{product.subcategory || "N/A"}</td>
                        </tr>
                      </tbody>
                    </table>
                    <Link
                      href={`/products/${product._id}`}
                      className="btn btn-outline-primary btn-sm mt-2 w-100"
                    >
                      More details
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-warning text-center">No products found for this category.</p>
            )}
          </div>
        </main>

        {/* Right Sidebar: Subcategories */}
        <aside className="col-md-3">
          <div className="bg-white p-3 rounded common-shad">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">Subcategories</h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : (
              <ul className="list-group">
                {subcategories.map((sub) => {
                  const isActive = sub.name.toLowerCase() === formatCategoryName(encodedCategory);
                  return (
                    <Link
                    key={sub._id} // ✅ Move key to Link
                    href={`/${encodedCategory}/${encodeURIComponent(sub.name.replace(/&/g, "and").replace(/ /g, "-"))}`}
                    className="text-decoration-none"
                  >
                    <li className={`list-group-item hover:bg-gray-100 ${isActive ? "active text-white bg-purple fw-bold" : "text-dark"}`}>
                      {sub.name}
                    </li>
                  </Link>
                  
                  );
                })}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CategoryPage;
