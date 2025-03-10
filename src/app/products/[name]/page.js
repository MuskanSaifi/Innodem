"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, setFilters } from "@/app/store/productSlice";
import CitySearchBar from "@/components/CitySearchBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../style.css";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { name } = useParams();
  const formattedSubcategory = decodeURIComponent(name.replace(/-/g, " ")); // ✅ Corrected variable name

  useEffect(() => {
    if (formattedSubcategory) {
      dispatch(fetchProducts(formattedSubcategory)); // ✅ Fetch products by subcategory
    }
  }, [formattedSubcategory, dispatch]);

  const { filteredProducts, loading, error, filters } = useSelector((state) => state.products);

  const [priceRange, setPriceRange] = useState(filters.priceRange);
  const [time, setTime] = useState(filters.time);

  const handleFilterChange = () => {
    dispatch(setFilters({ priceRange, time }));
  };

  return (
    <>
      <div className="container mt-2">
        <p className="m-0 fs-esm">
          Innodem / {filteredProducts.length > 0 ? filteredProducts[0].category : <Skeleton width={100} />}
          / {filteredProducts.length > 0 ? filteredProducts[0].subcategory : <Skeleton width={100} />}
        </p>
        <div className="d-flex">
          <h4 className="fs-esm">{formattedSubcategory} Products</h4> {/* ✅ Fixed */}
          <span className="fs-esm">({filteredProducts.length || <Skeleton width={30} />})</span>
        </div>
        <CitySearchBar />

        <div className="row">
          {/* Filters Section */}
          <div className="col-md-2">
            <div className="filter-box p-2 border rounded">
              <h6 className="fw-bold">Products in {formattedSubcategory}</h6> {/* ✅ Fixed */}
              <ul className="list-unstyled">
                {filteredProducts.map((product) => (
                  <li key={product._id} className="mb-1">
                    <a href={`/products/${product.name}`} className="text-dark">
                      {product.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Price Range Filter */}
              <label className="form-label mt-2">Price Range:</label>
              <input
                type="range"
                className="form-range"
                min="0"
                max="100000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              />
              <span className="d-block text-muted">₹{priceRange[0]} - ₹{priceRange[1]}</span>

              {/* Apply Filters Button */}
              <button className="btn btn-primary w-100 mt-3" onClick={handleFilterChange}>
                Apply Filters
              </button>
            </div>
          </div>

          {/* Product Listing Section */}
          <div className="col-md-7 mb-4">
            {loading ? (
              <Skeleton count={3} height={100} />
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product._id} className="card p-3 mb-3">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-3 text-center">
                      <img
                        src={product.images?.length > 0
                          ? `data:${product.images[0].contentType};base64,${product.images[0].data}`
                          : "/no-image.png"}
                        alt={product.name}
                        className="img-fluid rounded product-image"
                      />
                    </div>
                    <div className="col-md-5">
                      <h5 className="text-primary bg-light p-1">{product.name}</h5>
                      <div className="table-responsive">
                        <table className="table fs-esm">
                          <tbody>
                            <tr><th>Price</th><td>₹{product.price} {product.currency}</td></tr>
                            <tr><th>MOQ</th><td>{product.minimumOrderQuantity || "N/A"}</td></tr>
                            <tr><th>Colour</th><td>{product.specifications?.color || "N/A"}</td></tr>
                            <tr><th>Category</th><td>{product.category}</td></tr>
                            <tr><th>Subcategory</th><td>{product.subcategory}</td></tr>
                          </tbody>
                        </table>
                      </div>
                      <a href="#" className="text-info">More details...</a>
                    </div>
                    <div className="col-md-4">
                      <div className="supplier-box">
                        <h6 className="text-dark fw-bold">{product.supplier?.name || "Unknown Supplier"}</h6>
                        <p className="text-muted">{product.supplier?.location || "Location Not Available"}</p>
                        <button className="btn btn-primary w-100 mb-2">Get Best Quote</button>
                        <button className="btn btn-outline-secondary w-100">View Mobile Number</button>
                        <button className="btn btn-outline-dark w-100 mt-2">Contact Supplier</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found for {formattedSubcategory}.</p> // ✅ Removed extra quotes
            )}
            
          </div>

          {/* Right-Side Section */}
          <div className="col-md-3">
            <div className="custom-container">
              <h3 className="custom-title">Get Best Sellers for <strong>{formattedSubcategory}</strong></h3> {/* ✅ Fixed */}
              <div className="custom-radio-group d-flex flex-column">
                <label className="custom-radio">
                  <input type="radio" name="tradeType" defaultValue="buy" />
                  I want to Buy
                </label>
                <label className="custom-radio">
                  <input type="radio" name="tradeType" defaultValue="sell" defaultChecked />
                  I want to Sell
                </label>
              </div>
              <div className="custom-input-container">
                <label htmlFor="product-name" className="custom-label">Product Name</label>
                <input type="text" id="product-name" className="custom-input" defaultValue={formattedSubcategory} readOnly /> {/* ✅ Fixed */}
              </div>
              <button className="custom-button">NEXT →</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;
