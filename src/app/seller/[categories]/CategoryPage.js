"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CategoryPage = ({ categorySlug }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for mobile dropdowns
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/adminprofile/category");
        if (!response.ok) throw new Error("Failed to fetch category data");

        const data = await response.json();
        setCategories(data);

        if (!categorySlug) return;

        const category = data.find((cat) => cat.categoryslug === categorySlug);
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
  }, [categorySlug]);

  const getCategoryName = () => {
    const matched = categories.find((cat) => cat.categoryslug === categorySlug);
    return matched?.name || categorySlug;
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Breadcrumb */}
      <nav className="breadcrumb bg-light p-3 rounded">
        <span className="text-secondary">Home / {getCategoryName()}</span>
      </nav>

      {/* Mobile Dropdowns */}
      <div className="d-md-none mb-3">
        {/* Category Dropdown */}
        <div className="mb-2">
          <button
            className="btn btn-outline-primary w-100"
            type="button"
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)} // Toggle dropdown state
          >
            All Categories
          </button>
          {categoryDropdownOpen && (
            <div className="mt-2">
              {loading ? (
                <Skeleton count={5} height={20} />
              ) : (
                <ul className="list-group">
                  {categories.map((cat) => {
                    const isActive = cat.categoryslug === categorySlug;
                    return (
                      <Link
                        key={cat._id}
                        href={`/seller/${cat.categoryslug}`}
                        className="text-decoration-none"
                      >
                        <li
                          className={`list-group-item ${
                            isActive
                              ? "active text-white bg-purple fw-bold"
                              : "text-dark"
                          }`}
                        >
                          {cat.name}
                        </li>
                      </Link>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Subcategory Dropdown */}
        <div>
          <button
            className="btn btn-outline-secondary w-100"
            type="button"
            onClick={() => setSubcategoryDropdownOpen(!subcategoryDropdownOpen)} // Toggle dropdown state
          >
            Subcategories
          </button>
          {subcategoryDropdownOpen && (
            <div className="mt-2">
              {loading ? (
                <Skeleton count={5} height={20} />
              ) : (
                <ul className="list-group">
                  {subcategories.map((sub) => (
                    <Link
                      key={sub._id}
                      href={`/seller/${categorySlug}/${sub.subcategoryslug}`}
                      className="text-decoration-none"
                    >
                      <li className="list-group-item text-dark">{sub.name}</li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Layout */}
      <div className="row mt-4">
        {/* Sidebar */}
        <aside className="col-md-3 d-none d-md-block">
          <div className="bg-white p-3 rounded common-shad  sticky top-5">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              All Categories
            </h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : (
              <ul className="list-group">
                {categories.map((cat) => {
                  const isActive = cat.categoryslug === categorySlug;
                  return (
                    <Link
                      key={cat._id}
                      href={`/seller/${cat.categoryslug}`}
                      className="text-decoration-none"
                    >
                      <li
                        className={`list-group-item ${
                          isActive
                            ? "active text-white bg-purple fw-bold"
                            : "text-dark"
                        }`}
                      >
                        {cat.name}
                      </li>
                    </Link>
                  );
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Main Product Listing */}
        <main className="col-md-6 common-shad rounded-2 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="text-uppercase text-lg text-secondary">
              {getCategoryName()} Products
            </h1>
            <span className="badge bg-primary text-white fs-6">
              {loading ? <Skeleton width={30} /> : products.length}
            </span>
          </div>

          <div className="row g-4">
            {loading ? (
              <Skeleton count={6} height={150} />
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : products.length > 0 ? (
              products.map((product, index) => (
                <div key={`${product._id}-${index}`} className="col-md-6">
                  <div className="card border-0 shadow-sm p-3 rounded-3">
                    <div className="position-relative text-center">
                    <Image
  src={product.images?.[0]?.url || "/placeholder.png"}
  alt={product.name}
  width={180}
  height={180}
  className="rounded-md object-cover mx-auto block"
/>
                    </div>
                    <h6 className="mt-2 text-primary text-sm text-center">
                      {product.name}
                    </h6>
                    <table className="table table-sm mt-2 text-sm">
                      <tbody>
                        <tr>
                          <th>Price:</th>
                          <td>
                            ₹{product.price} {product.currency || "INR"}
                          </td>
                        </tr>
                        <tr>
                          <th>MOQ:</th>
                          <td>{product.minimumOrderQuantity || "N/A"}</td>
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
              <p className="text-warning text-center">
                No products found for this category.
              </p>
            )}
          </div>
        </main>

        {/* Subcategories Sidebar */}
        <aside className="col-md-3 d-none d-md-block">
          <div className="bg-white p-3 rounded common-shad sticky top-5">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Subcategories
            </h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : (
              <ul className="list-group">
                {subcategories.map((sub) => (
                  <Link
                    key={sub._id}
                    href={`/seller/${categorySlug}/${sub.subcategoryslug}`}
                    className="text-decoration-none"
                  >
                    <li className="list-group-item text-dark">{sub.name}</li>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CategoryPage;
