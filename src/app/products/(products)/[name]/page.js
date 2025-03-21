"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CitySearchBar from "@/components/CitySearchBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../../style.css";

const ProductPage = () => {
  const { name } = useParams();
  const formattedSubcategory = decodeURIComponent(name.replace(/-/g, " "));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/products?subcategory=${encodeURIComponent(formattedSubcategory)}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch products.");

        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (formattedSubcategory) {
      fetchProducts();
    }
  }, [formattedSubcategory]);

  if (typeof window === "undefined") return null; // ✅ Prevents SSR issues

  return (
    <>
      <div className="container mt-2">
        <p className="m-0 fs-esm">
          Innodem / {products.length > 0 ? products[0]?.category?.name : <Skeleton width={100} />}
          / {products.length > 0 ? products[0]?.subCategory?.name : <Skeleton width={100} />}
        </p>
        <div className="d-flex">
          <h4 className="fs-esm">{formattedSubcategory} Products</h4>
          <span className="fs-esm">({products.length || <Skeleton width={30} />})</span>
        </div>
        <CitySearchBar />

        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8 mb-4">
            {loading ? (
              <Skeleton count={3} height={100} />
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div key={product._id} className="card p-3 mb-3">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-3 text-center">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="img-fluid rounded product-image"
                        />
                      ) : (
                        <Skeleton width={80} height={80} />
                      )}
                    </div>
                    <div className="col-md-5">
                      <h5 className="text-primary bg-light p-1">{product.name}</h5>
                      <table className="table fs-esm">
                        <tbody>
                          <tr><th>Price</th><td>₹{product.price} {product.currency}</td></tr>
                          <tr><th>MOQ</th><td>{product.minimumOrderQuantity || "N/A"}</td></tr>
                          <tr><th>Colour</th><td>{product.specifications?.color || "N/A"}</td></tr>
                          <tr><th>Category</th><td>{product.category?.name || "Not Available"}</td></tr>
                          <tr><th>Subcategory</th><td>{product.subCategory?.name || "Not Available"}</td></tr>
                        </tbody>
                      </table>
                      <a href="#" className="text-info">More details...</a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No products found for {formattedSubcategory}.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;