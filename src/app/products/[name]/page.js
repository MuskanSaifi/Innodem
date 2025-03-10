"use client"; // ✅ Forces this component to render on the client-side

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/app/store/productSlice";
import CitySearchBar from "@/components/CitySearchBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../style.css";

const ProductPage = () => {
  const dispatch = useDispatch();
  const { name } = useParams();
  const formattedSubcategory = decodeURIComponent(name.replace(/-/g, " "));

  useEffect(() => {
    if (formattedSubcategory) {
      dispatch(fetchProducts(formattedSubcategory));
    }
  }, [formattedSubcategory, dispatch]);

  const { filteredProducts, loading, error } = useSelector((state) => state.products);

  if (typeof window === "undefined") return null; // ✅ Prevents SSR issues

  return (
    <>
      <div className="container mt-2">
        <p className="m-0 fs-esm">
          Innodem / {filteredProducts.length > 0 ? filteredProducts[0].category?.name : <Skeleton width={100} />}
          / {filteredProducts.length > 0 ? filteredProducts[0].subCategory?.name : <Skeleton width={100} />}
        </p>
        <div className="d-flex">
          <h4 className="fs-esm">{formattedSubcategory} Products</h4>
          <span className="fs-esm">({filteredProducts.length || <Skeleton width={30} />})</span>
        </div>
        <CitySearchBar />

        <div className="row">
          {/* Product Listing Section */}
          <div className="col-md-2"></div>
          <div className="col-md-8 mb-4">
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
  src={`data:${product.images[0].contentType};base64,${Buffer.from(
    product.images[0].data.data
  ).toString("base64")}`}
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
                            <tr><th>Category</th><td>{product.category?.name || "N/A"}</td></tr>
                            <tr><th>Subcategory</th><td>{product.subCategory?.name || "N/A"}</td></tr>
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
