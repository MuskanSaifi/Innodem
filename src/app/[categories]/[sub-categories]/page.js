"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image
import CitySearchBar from "@/components/CitySearchBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SubcategoryProductPage = () => {
  const { categories: encodedCategory, "sub-categories": encodedSubcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategory, setSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to format subcategory names for comparison
  const formatSubcategoryName = (name) => {
    return decodeURIComponent(name)
      .replace(/-/g, " ") // Convert hyphens to spaces
      .replace(/and/g, "&") // Convert "and" back to "&"
      .trim()
      .toLowerCase();
  };

  useEffect(() => {
    if (!encodedSubcategory) return;

    const fetchSubcategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/adminprofile/subcategory`, { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Failed to fetch subcategories.");

        const formattedSubcategory = formatSubcategoryName(encodedSubcategory);

        // Find the matching subcategory
        const matchedSubcategory = data.find(
          (sub) => sub.name.trim().toLowerCase() === formattedSubcategory
        );

        if (!matchedSubcategory) {
          setError("Subcategory not found.");
          return;
        }

        setSubcategory(matchedSubcategory);
        setProducts(matchedSubcategory.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [encodedSubcategory]);

  return (
    <div className="container mt-2">
      <p className="m-0 fs-esm">
        Innodem / {subcategory?.category?.name || <Skeleton width={100} />} /{" "}
        {subcategory?.name || <Skeleton width={100} />}
      </p>
      <div className="d-flex">
        <h4 className="fs-esm">{subcategory?.name || ""} Products</h4>
        <span className="fs-esm">
          ({loading ? <Skeleton width={30} /> : products.length})
        </span>
      </div>
      <CitySearchBar />
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8 mb-4">
          {loading ? (
            <Skeleton count={3} height={100} />
          ) : error ? (
            <p className="error-message text-danger">{error}</p>
          ) : products.length > 0 ? (
            products.map((product) => {
              return (
                <div key={product._id} className="card p-3 mb-3">
                  <div className="row g-3 align-items-center">
                    <div className="col-md-3 text-center">
                      <Image
                        src={product.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="rounded product-image"
                        style={{ objectFit: "cover", borderRadius: "5px" }}
                        priority={false} // Lazy load
                      />
                    </div>
                    <div className="col-md-5">
                      <h5 className="text-primary bg-light p-1">{product.name}</h5>
                      <div className="table-responsive">
                        <table className="table fs-esm">
                          <tbody>
                            <tr>
                              <th>Price</th>
                              <td>
                                ₹{product.price} {product.currency || "INR"}
                              </td>
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
                              <td>{subcategory?.category?.name || "Not Available"}</td>
                            </tr>
                            <tr>
                              <th>Subcategory</th>
                              <td>{subcategory?.name || "Not Available"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <Link
  href={`/${encodedCategory}/${encodedSubcategory}/${encodeURIComponent(
    product.name.replace(/\s+/g, "-").toLowerCase()
  )}`}
  className="text-info"
>
  More details...
</Link>

                    </div>
                    <div className="col-md-4">
                      <div className="supplier-box"></div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-warning">
              No products found for {subcategory?.name || "this subcategory"}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubcategoryProductPage;
