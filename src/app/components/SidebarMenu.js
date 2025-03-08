"use client";

import React, { useState, useEffect, useRef } from "react";
import "../styles/header.css";
import Link from "next/link"; // ✅ Import Link for navigation

const SidebarMenu = () => {
  const [activeCategory, setActiveCategory] = useState("TopCategories"); // Set default category
  const [allcategories, setAllcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const menuRef = useRef(null);

  const handleMouseEnterCategory = (id) => {
    setActiveCategory(id);
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveCategory("TopCategories"); // Keep default category visible
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/adminprofile/category");
        const data = await response.json();
        setAllcategories(data);
      } catch (error) {
        setError("Failed to load categories");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchdata();
  }, []);

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="menu" ref={menuRef}>
      <div className="category">
        <span>Top Categories</span>
      </div>

      <div className="dropdown">
        <ul>
          {allcategories.map((category) => (
            <li
              key={category._id}
              onMouseEnter={() => handleMouseEnterCategory(category._id)}
              className={activeCategory === category._id ? "active" : ""}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      {allcategories.map(
        (category) =>
          activeCategory === category._id && (
            <div key={category._id} className="mega-menu">
              <div className="row">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory._id} className="col-md-4">
                    <div className="subcategory">
                      <h3>{subcategory.name}</h3>
                      <ul>
                        {subcategory.products.map((product) => (
                          <li key={product._id}>
                            {/* ✅ Clicking product name opens new page `/products/[name]` */}
                            <Link href={`/products/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, "-"))}`}>
                              {product.name}
                            </Link>

                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
      )}
    </div>
  );
};

export default SidebarMenu;
