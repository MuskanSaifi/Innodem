// src/components/CategoryPage.js
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Buyfrom from "./Buyfrom";
import { FaCheckCircle, FaMapMarkerAlt, FaUserClock } from "react-icons/fa";
import { FaHeart, FaRegHeart } from 'react-icons/fa'; // Import heart icons

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import { addProductToWishlist, removeProductFromWishlist } from '../../store/wishlistSlice'; // Adjust path if necessary

const CategoryPage = ({ categorySlug }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryContent, setCategoryContent] = useState("");

  // State for mobile dropdowns
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [subcategoryDropdownOpen, setSubcategoryDropdownOpen] = useState(false);

  // Redux hooks for wishlist
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const user = useSelector((state) => state.user.user); // Assuming you have user state for login check

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
        setCategoryContent(category.content || "");
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

  // Helper function to check if a value should be displayed
  const shouldDisplay = (value) => {
    if (value === null || typeof value === 'undefined') {
      return false;
    }
    if (typeof value === 'string' && (value.trim() === '' || value.trim().toLowerCase() === 'n/a')) {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  };

  // Check if a product is in the wishlist
  const isProductInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (product) => {
    if (!user) {
      alert("Please log in to add items to your wishlist."); // Or redirect to login page
      return;
    }
    if (isProductInWishlist(product._id)) {
      dispatch(removeProductFromWishlist(product._id));
    } else {
      dispatch(addProductToWishlist(product));
    }
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
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
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
          <div className="bg-white p-3 rounded common-shad sticky top-5">
            <div className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              All Categories
            </div>

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
                  <div className="card border-0 shadow-sm p-3 rounded-3 position-relative">
                    {/* Wishlist Button */}
                    <button
                      className="btn btn-link p-0 position-absolute top-0 end-0 m-2"
                      onClick={() => handleWishlistToggle(product)}
                      title={isProductInWishlist(product._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                      disabled={loading} // Disable if product data is still loading
                    >
                      {isProductInWishlist(product._id) ? (
                        <FaHeart size={16} className="text-danger" />
                      ) : (
                        <FaRegHeart size={16} className="text-muted" />
                      )}
                    </button>

                    <div className="position-relative text-center">
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.png"}
                        alt={product.name}
                        width={180}
                        height={180}
                        className="rounded-md object-cover mx-auto block"
                        onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "/placeholder.png"; }}
                      />
                    </div>
                    <h2 className="mt-2 text-primary text-sm text-center">
                      {product.name}
                    </h2>
                    <p className="text-sm">
                      {product.description
                        ? product.description.split(" ").slice(0, 15).join(" ") + (product.description.split(" ").length > 20 ? "..." : "")
                        : "N/A"}
                    </p>
                    {/* Company Info Section */}
                    {product.businessProfile && shouldDisplay(product.businessProfile.companyName) && (
                      <div className="mb-3 pb-2 border-bottom">
                        <h3 className="fw-bold text-dark text-sm mb-2">{product.businessProfile.companyName}</h3>
                        <div className="d-flex flex-wrap align-items-center text-sm">
                          {/* Location */}
                          {(shouldDisplay(product.businessProfile.city) || shouldDisplay(product.businessProfile.state)) && (
                            <div className="d-flex align-items-center text-muted me-3 mb-1">
                              <FaMapMarkerAlt className="me-1 text-secondary" />
                              <span>
                                {product.businessProfile.city}
                                {product.businessProfile.city && product.businessProfile.state ? ", " : ""}
                                {product.businessProfile.state}
                              </span>
                            </div>
                          )}

                          {/* GST */}
                          {shouldDisplay(product.businessProfile.gstNumber) && (
                            <span className="me-3 text-success d-flex align-items-center mb-1">
                              <FaCheckCircle className="me-1" /> GST
                            </span>
                          )}

                          {/* TrustSEAL badge */}
                          {product.businessProfile.trustSealVerified && (
                            <span className="me-3 text-warning d-flex align-items-center mb-1">
                              <FaCheckCircle className="me-1" /> TrustSEAL Verified
                            </span>
                          )}

                          {/* Member Year */}
                          {shouldDisplay(product.businessProfile.yearOfEstablishment) && (
                            <span className="text-muted d-flex align-items-center mb-1">
                              <FaUserClock className="me-1" /> Member: {new Date().getFullYear() - product.businessProfile.yearOfEstablishment} yrs
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    <table className="table table-sm mt-2 text-sm">
                      <tbody>
                        {shouldDisplay(product.tradeShopping?.fixedSellingPrice || product.price) && (
                          <tr>
                            <th>Price:</th>
                            <td>
                              ₹{product.tradeShopping?.fixedSellingPrice || product.price}{" "}
                              {product.currency || "INR"}
                            </td>
                          </tr>
                        )}
                        {shouldDisplay(product.minimumOrderQuantity) && (
                          <tr>
                            <th>MOQ:</th>
                            <td>{product.minimumOrderQuantity}</td>
                          </tr>
                        )}
                        {shouldDisplay(product.tradeShopping?.brandName) && (
                          <tr>
                            <th>Brand:</th>
                            <td>{product.tradeShopping.brandName}</td>
                          </tr>
                        )}
                        {shouldDisplay(product.tradeShopping?.unit) && (
                          <tr>
                            <th>Unit:</th>
                            <td>{product.tradeShopping.unit}</td>
                          </tr>
                        )}
                        {shouldDisplay(product.tradeShopping?.stockQuantity) && (
                          <tr>
                            <th>Stock:</th>
                            <td>{product.tradeShopping.stockQuantity}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                    <Link
                      href={`/products/${product._id}`}
                      className="btn btn-outline-primary btn-sm mt-2 w-100"
                    >
                      More details
                    </Link>
                    <Buyfrom product={product} sellerId={product?.userId} />
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
            <div className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Subcategories
            </div>

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

      <div className="mt-4">
        {/* Category HTML Content */}
        {categoryContent && (
          <div
            className="bg-white p-3 mb-4"
            dangerouslySetInnerHTML={{ __html: categoryContent }}
          />
        )}
      </div>
    </div>
  );
};

export default CategoryPage;