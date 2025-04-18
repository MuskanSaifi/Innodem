"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const IndustryPage = () => {
  const [industries, setIndustries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndustries = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoryResponse = await fetch("/api/adminprofile/category", { cache: "no-store" });
        if (!categoryResponse.ok) throw new Error("Failed to fetch categories");

        const categories = await categoryResponse.json();

        // Fetch subcategories
        const subcategoryResponse = await fetch("/api/adminprofile/subcategory", { cache: "no-store" });
        if (!subcategoryResponse.ok) throw new Error("Failed to fetch subcategories");

        const subcategories = await subcategoryResponse.json();

        // Convert subcategory list into a map for quick lookup
        const subcategoryMap = subcategories.reduce((acc, sub) => {
          acc[sub._id] = {
            id: sub._id,
            name: sub.name,
            productsCount: sub.products.length || 0,
          };
          return acc;
        }, {});

        // Attach full subcategory details to categories
        const formattedIndustries = categories.map((category) => ({
          id: category._id,
          name: category.name,
          slug:category.categoryslug,
          icon: category.icon || "/default-icon.png",
          subcategories: category.subcategories
            .map((subId) => subcategoryMap[subId])
            .filter(Boolean), // Remove undefined values
        }));

        setIndustries(formattedIndustries);
      } catch (err) {
        console.error("Error fetching industries:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIndustries();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="text-primary">Top B2B Industries in India</h2>
      <p>Explore the fastest-growing industries in India.</p>

      <div className="cta-box p-4 bg-light border rounded text-center mb-4">
        <h4 className="text-danger">Want to Sell?</h4>
        <p><strong>Your products</strong> to millions of <strong>buyers</strong>!</p>
        <button className="btn btn-danger">List your Company Free</button>
      </div>

      <div className="row">
        {loading ? (
          [...Array(6)].map((_, index) => (
            <div key={index} className="col-md-4 mb-4">
              <Skeleton height={100} />
            </div>
          ))
        ) : error ? (
          <p className="text-danger">{error}</p>
        ) : industries.length > 0 ? (
          industries.map((industry) => (
            <div key={industry.id} className="col-md-4 mb-4">
              <div className="card p-3 border rounded">
                <div className="d-flex align-items-center mb-2">
                  <Image src={industry.icon} alt={industry.name} width={40} height={40} className="me-2" />
                  <h5 className="m-0 text-primary">{industry.name}</h5>
                </div>
                <ul className="list-unstyled">
                  {industry.subcategories.slice(0, 4).map((sub) => (
                    <li key={sub.id}>
                      &gt; {sub.name} ({sub.productsCount} products)
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/seller/${encodeURIComponent(industry.slug)}`}
                  className="text-info"
                >
                  View More
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No industries available.</p>
        )}
      </div>
    </div>
  );
};

export default IndustryPage;
