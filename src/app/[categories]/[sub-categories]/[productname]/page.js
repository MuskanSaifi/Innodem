"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CitySearchBar from "@/components/CitySearchBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import BuySellForm from "@/components/BuySellform";

const ProductPage = () => {
  const { productname } = useParams();
  const router = useRouter();

  // ✅ Format subcategory name from URL
  const formattedSubcategory = decodeURIComponent(productname.replace(/-/g, " "));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!formattedSubcategory) return;

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

    fetchProducts();
  }, [formattedSubcategory]);

  if (typeof window === "undefined") return null; // ✅ Prevents SSR issues

  return (
    <>
      <BuySellForm />
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
              products.map((product) => {
                // ✅ Ensure product image is fetched correctly
                let productImage = "https://via.placeholder.com/100"; // Default placeholder

                if (product.images && product.images.length > 0) {
                  productImage = product.images[0];
                }

                return (
                  <div key={product.name} className="card p-3 mb-3">
                    <div className="row g-3 align-items-center">
                      <div className="col-md-3 text-center">
                        <img
                          src={productImage}
                          alt={product.name}
                          className="img-fluid rounded product-image"
                          style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "5px" }}
                        />
                      </div>
                      <div className="col-md-5">
                        <h5
                          className="text-primary bg-light p-1 cursor-pointer"
                          onClick={() =>
                            router.push(`/${encodeURIComponent(product.category.name)}/${encodeURIComponent(product.subCategory.name)}/${encodeURIComponent(product.name)}`)
                          }
                        >
                          {product.name}
                        </h5>
                        <div className="table-responsive">
                          <table className="table fs-esm">
                            <tbody>
                              <tr><th>Price</th><td>₹{product.price} {product.currency || "INR"}</td></tr>
                              <tr><th>MOQ</th><td>{product.minimumOrderQuantity || "N/A"}</td></tr>
                              <tr><th>Colour</th><td>{product.specifications?.color || "N/A"}</td></tr>
                              <tr><th>Category</th><td>{product.category ? product.category.name : "Not Available"}</td></tr>
                              <tr><th>Subcategory</th><td>{product.subCategory ? product.subCategory.name : "Not Available"}</td></tr>
                            </tbody>
                          </table>
                        </div>
                        <a href="#" className="text-info">More details...</a>
                      </div>
                      <div className="col-md-4">
                        <div className="supplier-box"></div>
                      </div>
                    </div>
                  </div>
                );
              })
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
