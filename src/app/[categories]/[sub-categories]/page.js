"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SubcategoryProductPage = () => {
  const { categories: encodedCategory, "sub-categories": encodedSubcategory } = useParams();
  
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatName = (name) =>
    decodeURIComponent(name)
      .replace(/-/g, " ")
      .replace(/and/g, "&")
      .trim()
      .toLowerCase();

  useEffect(() => {
    if (!encodedCategory || !encodedSubcategory) return;

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/adminprofile/category`);
        if (!response.ok) throw new Error("Failed to fetch category data");

        const categories = await response.json();
        const formattedCategory = formatName(encodedCategory);
        const category = categories.find(
          (cat) => cat.name.trim().toLowerCase() === formattedCategory
        );

        if (!category) throw new Error("Category not found");

        setSubcategories(category.subcategories || []);

        const formattedSubcategory = formatName(encodedSubcategory);
        const matchedSubcategory = category.subcategories.find(
          (sub) => sub.name.trim().toLowerCase() === formattedSubcategory
        );

        if (!matchedSubcategory) throw new Error("Subcategory not found");

        setProducts(matchedSubcategory.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [encodedCategory, encodedSubcategory]);

  return (
    <div className="container mt-4">
      {/* Breadcrumb Navigation */}
      <nav className="breadcrumb bg-light p-3 rounded">
        <Link href="/" className="text-decoration-none text-secondary">
          Home
        </Link>{" "}
        /{" "}
        <Link
          href={`/${encodedCategory}`}
          className="text-decoration-none text-secondary"
        >
          {loading ? <Skeleton width={100} /> : formatName(encodedCategory)}
        </Link>{" "}
        /{" "}
        <span className="text-primary">
          {loading ? <Skeleton width={100} /> : formatName(encodedSubcategory)}
        </span>
      </nav>

      <div className="row mb-5">
        {/* Left Sidebar: Subcategories */}
        <aside className="col-md-3">
          <div className="bg-white p-3 rounded common-shad">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">Subcategories</h5>
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
                        isActive ? "active text-white bg-primary fw-bold" : "text-dark"
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

        {/* Main Content: Products */}
        <div className="col-md-6 common-shad">
          <div className="d-flex justify-content-between align-items-center mb-3 p-2 mt-3">
            <h4 className="text-uppercase text-secondary">
              {loading ? <Skeleton width={200} /> : formatName(encodedSubcategory)}
            </h4>
            <span className="badge bg-primary text-white fs-6">
              {loading ? <Skeleton width={30} /> : products.length}
            </span>
          </div>

          <div className="row g-4">
            {loading ? (
              <Skeleton count={6} height={200} />
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="col-md-6">
                  <div className="card border-0 shadow-sm p-3 rounded-3">
                    <div className="position-relative text-center">
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.png"}
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
                No products found for this subcategory.
              </p>
            )}
          </div>
        </div>

        {/* Right Sidebar: Products in the Same Subcategory */}
        <aside className="col-md-3">
          <div className="bg-white p-3 rounded common-shad">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Products in {formatName(encodedSubcategory)}
            </h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : (
              <ul className="list-group">
                {products.map((product) => (
                  <li key={product._id} className="list-group-item border-0">
                    <Link
                      href={`/${encodedCategory}/${encodedSubcategory}/${encodeURIComponent(
                        product.name.replace(/\s+/g, "-").toLowerCase()
                      )}`}
                      className="text-web text-decoration-none common-shad d-block p-2 rounded-2"
                    >
                      {product.name}
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

export default SubcategoryProductPage;
