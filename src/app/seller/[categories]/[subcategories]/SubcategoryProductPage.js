"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SubcategoryProductPage = () => {
  const params = useParams();
  const categorySlug = params?.["categories"];
  const subcategorySlug = params?.["subcategories"];

  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dropdown states for mobile
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);

  const decode = (str) => decodeURIComponent(str).toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      if (!categorySlug || !subcategorySlug) return;
      try {
        setLoading(true);
        const res = await fetch("/api/adminprofile/category");
        const data = await res.json();

        const category = data.find(
          (cat) => cat.categoryslug.toLowerCase() === decode(categorySlug)
        );

        if (!category) throw new Error("Category not found");

        setSubcategories(category.subcategories || []);

        const subcat = category.subcategories.find(
          (sub) => sub.subcategoryslug?.toLowerCase() === decode(subcategorySlug)
        );

        if (!subcat) throw new Error("Subcategory not found");

        setProducts(subcat.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categorySlug, subcategorySlug]);

  return (
    <div className="container mt-4 mb-5">
      {/* Breadcrumb */}
      <nav className="breadcrumb bg-light p-3 rounded">
        <Link href="/" className="text-decoration-none text-secondary">Home</Link> /{" "}
        <Link href={`/seller/${categorySlug}`} className="text-decoration-none text-secondary">
          {loading ? <Skeleton width={100} /> : decode(categorySlug)}
        </Link>{" "}
        / <span className="text-primary">
          {loading ? <Skeleton width={100} /> : decode(subcategorySlug)}
        </span>
      </nav>

      {/* Mobile Dropdowns */}
      <div className="d-md-none mb-3">
        {/* Subcategory Dropdown */}
        <div className="mb-2">
          <button
            className="btn btn-outline-secondary w-100"
            type="button"
            onClick={() => setSubcategoryDropdownOpen(!subcategoryDropdownOpen)}
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
                      <li
                        className={`list-group-item ${
                          decode(sub.subcategoryslug) === decode(subcategorySlug)
                            ? "active text-white bg-purple fw-bold"
                            : "text-dark"
                        }`}
                      >
                        {sub.name}
                      </li>
                    </Link>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Product Dropdown */}
        <div>
          <button
            className="btn btn-outline-primary w-100"
            type="button"
            onClick={() => setProductDropdownOpen(!productDropdownOpen)}
          >
            {productDropdownOpen ? "Hide Products" : "Show Products"}
          </button>
          {productDropdownOpen && (
            <div className="mt-2">
              {loading ? (
                <Skeleton count={5} height={20} />
              ) : products.length > 0 ? (
                <ul className="list-group">
                  {products.map((product) => (
                    <Link
                      key={product._id}
                      href={`/products/${product._id}`}
                      className="text-decoration-none"
                    >
                      <li className="list-group-item text-dark">{product.name}</li>
                    </Link>
                  ))}
                </ul>
              ) : (
                <p className="text-warning text-center">No products found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="row">
        {/* Sidebar (Desktop) */}
        <aside className="col-md-3 d-none d-md-block">
          <div className="bg-white p-3 rounded common-shad  sticky top-5">
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
                    <li
                      className={`list-group-item ${
                        decode(sub.subcategoryslug) === decode(subcategorySlug)
                          ? "active text-white bg-purple fw-bold"
                          : "text-dark"
                      }`}
                    >
                      {sub.name}
                    </li>
                  </Link>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Product Listing */}
        <main className="col-md-6 common-shad rounded-2 p-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1 className="text-uppercase text-lg text-secondary">
              {loading ? <Skeleton width={200} /> : decode(subcategorySlug)} Products
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
                        className="rounded img-fluid m-auto"
                        style={{ objectFit: "cover" }}
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
                No products found for this subcategory.
              </p>
            )}
          </div>
        </main>

         {/* Products Sidebar */}
         <aside className="col-md-3 d-none d-md-block">
          <div className="bg-white p-3 rounded common-shad  sticky top-5">
            <h5 className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Products in {decode(subcategorySlug)}
            </h5>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : (
              <ul className="list-group">
                {products.map((product) => (
                  <li key={product._id} className="list-group-item border-0 p-1">
                    <Link
                      href={`/manufacturers/${product.productslug}`}
                      className="text-web text-decoration-none common-shad d-block p-2 rounded-2 hover:bg-gray-100"
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
