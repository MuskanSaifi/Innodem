"use client";
import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";

const SidebarMenu = () => {
  const [activeCategory, setActiveCategory] = useState("TopCategories");
  const menuRef = useRef(null);

  // ✅ Get categories from Redux store
  const { data: allcategories, loading, error } = useSelector((state) => state.categories);

  const handleMouseEnterCategory = (id) => {
    setActiveCategory(id);
  };

  const handleOutsideClick = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setActiveCategory("TopCategories"); // Reset to default
    }
  };

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
