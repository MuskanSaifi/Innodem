"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Buyfrom from "./Buyfrom"; // Assuming these are correctly imported and used
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaUser,
  FaUserClock,
  FaHeart, // Import filled heart icon
  FaRegHeart, // Import regular (empty) heart icon
} from "react-icons/fa";

// Redux Imports
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToWishlist,
  removeProductFromWishlist,
  fetchUserWishlist,
} from "../../../store/wishlistSlice";

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

  // Redux Hooks
  const dispatch = useDispatch();
  const { items: wishlistItems, loading: wishlistLoading } = useSelector(
    (state) => state.wishlist
  );
  const user = useSelector((state) => state.user.user); // Get user from userSlice

  // Effect to fetch user's wishlist when component mounts or user state changes
  useEffect(() => {
    if (user && user._id) {
      // Ensure user is logged in and has an ID
      dispatch(fetchUserWishlist());
    }
  }, [user, dispatch]); // Re-fetch if user logs in/out

  // Handle adding/removing product from wishlist
  const handleToggleWishlist = (productId) => {
    if (!user) {
      alert("Please log in to manage your wishlist!"); // Or show a toast/modal
      return;
    }

    // Check if the product is currently in the wishlist
    const isInWishlist = wishlistItems.some((item) => item._id === productId);

    if (isInWishlist) {
      dispatch(removeProductFromWishlist(productId));
    } else {
      dispatch(addProductToWishlist(productId));
    }
  };

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

  // Helper function to check if a value should be displayed
  const shouldDisplay = (value) => {
    if (value === null || typeof value === "undefined") {
      return false;
    }
    if (
      typeof value === "string" &&
      (value.trim() === "" || value.trim().toLowerCase() === "n/a")
    ) {
      return false;
    }
    if (Array.isArray(value) && value.length === 0) {
      return false;
    }
    return true;
  };

  return (
    <div className="container mt-4 mb-5">
      {/* Breadcrumb */}
      <nav className="breadcrumb bg-light p-3 rounded">
        <Link href="/" className="text-decoration-none text-secondary">
          Home
        </Link>{" "}
        /{" "}
        <Link
          href={`/seller/${categorySlug}`}
          className="text-decoration-none text-secondary"
        >
          {loading ? <Skeleton width={100} /> : decode(categorySlug)}
        </Link>{" "}
        /{" "}
        <span className="text-primary">
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
                          decode(sub.subcategoryslug) ===
                          decode(subcategorySlug)
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
                      <li className="list-group-item text-dark">
                        {product.name}
                      </li>
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
              {loading ? <Skeleton width={200} /> : decode(subcategorySlug)}{" "}
              Products
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
              products.map((product, index) => {
                const isInWishlist = wishlistItems.some(
                  (item) => item._id === product._id
                );

                return (
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
                        {/* Wishlist Icon */}
                        {user && ( // Only show wishlist icon if a user is logged in
                          <button
                            className={`btn btn-link p-0 position-absolute top-0 end-0 m-2 ${
                              isInWishlist ? "text-danger" : "text-muted"
                            }`}
                            onClick={() => handleToggleWishlist(product._id)}
                            disabled={wishlistLoading} // Disable button while API call is in progress
                            title={
                              isInWishlist
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                            }
                            aria-label={
                              isInWishlist
                                ? "Remove from Wishlist"
                                : "Add to Wishlist"
                            }
                          >
                            {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                          </button>
                        )}
                      </div>

                      <h2 className="mt-2 text-primary text-sm text-center">
                        {product.name}
                      </h2>
                      <p className=" text-sm">
                        {product.description
                          ? product.description
                              .split(" ")
                              .slice(0, 15)
                              .join(" ") +
                            (product.description.split(" ").length > 20
                              ? "..."
                              : "")
                          : "N/A"}
                      </p>
                      {/* Company Info Section */}
                      {product.businessProfile &&
                        shouldDisplay(product.businessProfile.companyName) && (
                          <div className="mb-3 pb-2 border-bottom">
                            <h3 className="fw-bold text-dark text-sm mb-2">
                              {product.businessProfile.companyName}
                            </h3>
                            <div className="d-flex flex-wrap align-items-center text-sm">
                              {/* Location */}
                              {(shouldDisplay(product.businessProfile.city) ||
                                shouldDisplay(
                                  product.businessProfile.state
                                )) && (
                                <div className="d-flex align-items-center text-muted me-3">
                                  <FaMapMarkerAlt className="me-1 text-secondary" />
                                  <span>
                                    {product.businessProfile.city}
                                    {product.businessProfile.city &&
                                    product.businessProfile.state
                                      ? ", "
                                      : ""}
                                    {product.businessProfile.state}
                                  </span>
                                </div>
                              )}
                              {/* GST */}
                              {shouldDisplay(
                                product.businessProfile.gstNumber
                              ) && (
                                <span className="me-3 text-success d-flex align-items-center mb-1">
                                  <FaCheckCircle className="me-1" /> GST
                                </span>
                              )}
                              {/* TrustSEAL badge */}
                              {product.businessProfile.trustSealVerified && (
                                <span className="me-3 text-warning d-flex align-items-center mb-1">
                                  <FaCheckCircle className="me-1" /> TrustSEAL
                                  Verified
                                </span>
                              )}
                              {/* Member Year */}
                              {shouldDisplay(
                                product.businessProfile.yearOfEstablishment
                              ) && (
                                <span className="text-muted d-flex align-items-center mb-1">
                                  <FaUserClock className="me-1" /> Member:{" "}
                                  {new Date().getFullYear() -
                                    product.businessProfile
                                      .yearOfEstablishment}{" "}
                                  yrs
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                      <table className="table table-sm mt-2 text-sm">
                        <tbody>
                          {shouldDisplay(
                            product.tradeShopping?.fixedSellingPrice ||
                              product.price
                          ) && (
                            <tr>
                              <th>Price:</th>
                              <td>
                                ₹
                                {product.tradeShopping?.fixedSellingPrice ||
                                  product.price}{" "}
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
                          {shouldDisplay(
                            product.tradeShopping?.stockQuantity
                          ) && (
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
                );
              })
            ) : (
              <p className="text-warning text-center">
                No products found for this subcategory.
              </p>
            )}
          </div>
        </main>

        {/* Products Sidebar */}
        <aside className="col-md-3 d-none d-md-block">
          <div className="bg-white p-3 rounded common-shad sticky top-5">
            <div className="mb-3 text-light global-heading rounded-2 common-shad px-4 text-center py-1 text-sm">
              Products in {decode(subcategorySlug)}
            </div>
            {loading ? (
              <Skeleton count={5} height={20} />
            ) : (
              <ul className="list-group">
                {products.map((product) => (
                  <li key={product._id} className="list-group-item border-0 p-1">
                    <Link
                      href={`/products/${product._id}`}
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