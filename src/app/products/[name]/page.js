"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import CitySearchBar from "@/app/components/CitySearchBar";
import "../style.css"


const ProductPage = () => {
  const { name } = useParams();
  const formattedName = decodeURIComponent(name.replace(/-/g, " "));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!formattedName) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(`/api/products?name=${encodeURIComponent(formattedName)}`);
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [formattedName]);

  return (
    <>
      <div className="container mt-2">
        <p className="m-0 fs-esm">Innodem / {products.length > 0 ? products[0].category : "N/A"} / {products.length > 0 ? products[0].subcategory : "N/A"} </p>
        <div className="d-flex">
          <h4 className="fs-esm">{formattedName} Products </h4>
          <span className="fs-esm">( {products.length} )</span>
        </div>
        <CitySearchBar />


        {loading ? (
          <p>Loading...</p>
        ) : products.length > 0 ? (
          <div className="row">
            {/* Left Empty Space */}
            <div className="col-md-2"></div>

            {/* Main Product Details Section */}
            <div className="col-md-7 mb-4">
              {products.map((product) => (
                <div key={product._id} className="card p-3">
                  <div className="row g-3 align-items-center">
                    {/* Left: Product Image */}
                    <div className="col-md-3 text-center">
                      <img
                        src={
                          product.images?.length > 0
                            ? `data:${product.images[0].contentType};base64,${product.images[0].data}`
                            : "/no-image.png"
                        }
                        alt={product.name}
                        className="img-fluid rounded product-image"
                      />
                    </div>

                    {/* Middle: Product Details */}
                    <div className="col-md-5">
                      <h5 className="text-primary bg-light p-1">{product.name}</h5>
                      <div className="table-responsive">
                        <table className="table fs-esm">
                          <tbody>
                            <tr>
                              <th>Price</th>
                              <td>₹{product.price} {product.currency}</td>
                            </tr>
                            <tr>
                              <th>MOQ</th>
                              <td>{product.minimumOrderQuantity || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Colour</th>
                              <td>{product.specifications?.color || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Category</th>
                              <td>{product.category}</td>
                            </tr>
                            <tr>
                              <th>Subcategory</th>
                              <td>{product.subcategory}</td>
                            </tr>
                            <tr>
                              <th>Used By</th>
                              <td>{product.usedBy || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Accessory Type</th>
                              <td>{product.accessoryType || "N/A"}</td>
                            </tr>
                            <tr>
                              <th>Material</th>
                              <td>{product.specifications?.material || "N/A"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <a href="#" className="text-info">More details...</a>
                    </div>


                    {/* Right: Supplier Info & Actions */}
                    <div className="col-md-4 nnn">
                      <div className="supplier-box">
                        <h6 className="text-dark fw-bold">{product.supplier?.name || "Unknown Supplier"}</h6>
                        <p className="text-muted">{product.supplier?.location || "Location Not Available"}</p>
                        <p><span className="badge bg-success">Trusted Seller</span> {product.supplier?.years} Years</p>
                        <button className="btn btn-primary w-100 mb-2">Get Best Quote</button>
                        <button className="btn btn-outline-secondary w-100">View Mobile Number</button>
                        <button className="btn btn-outline-dark w-100 mt-2">Contact Supplier</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Side Form */}
            <div className="col-md-3">
              <div className="custom-container">
                <h3 className="custom-title">Get Best Sellers for <strong>{formattedName}</strong></h3>
                {/* Radio Buttons */}
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
                {/* Input Field */}
                <div className="custom-input-container">
                  <label htmlFor="product-name" className="custom-label">Product Name</label>
                  <input type="text" id="product-name" className="custom-input" defaultValue={formattedName} readOnly />
                </div>
                {/* Button */}
                <button className="custom-button">NEXT →</button>
              </div>
            </div>
          </div>


        ) : (
          <p>No products found for "{formattedName}".</p>
        )}
      </div>
    </>

  );
};

export default ProductPage;
