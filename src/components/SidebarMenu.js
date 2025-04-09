"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const SidebarMenu = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const menuRef = useRef(null);
  const router = useRouter();

  const { data: allcategories, loading, error } = useSelector((state) => state.categories);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveCategory(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  if (loading) return <div className="spinner">Loading...</div>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="menu bg-white rounded-md w-64" ref={menuRef}>
      {/* Top Categories */}
      <Link href="/industry">
        <div className="category font-semibold text-lg mb-2">Top Categories</div>
      </Link>

      {/* Category List */}
      <ul className="border border-b border-gray-300 p-2">
        {allcategories.map((category) => (
          <li
            key={category._id}
            className={`cursor-pointer hover:bg-gray-100 py-2 rounded-md ${
              activeCategory === category._id ? "bg-gray-200" : ""
            }`}
            onClick={() => router.push(`/seller/${category.categoryslug}`)}
            onMouseEnter={() => setActiveCategory(category._id)}
          >
            <div className="flex items-center">
              <Image
                src={category.icon || "/default-category.png"}
                alt={category.name}
                width={24}
                height={24}
                className="w-6 h-6 mr-2"
                unoptimized
              />
              <span className="text-sm">{category.name}</span>
            </div>
          </li>
        ))}
        <div className="text-center mt-3">
          <Link className="cursor-pointer p-2 common-shad rounded-2 gradient-btn text-sm" href="all-categories">
            View more categories...
          </Link>
        </div>
      </ul>

      {/* Mega Menu for Active Category */}
      {allcategories.map(
        (category) =>
          activeCategory === category._id && (
            <div key={category._id} className="mega-menu mt-2 p-3 border border-gray-300 rounded-md bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {category.subcategories.map((subcategory) => (
                  <div key={subcategory._id} className="subcategory">
                    <h3
                      className="font-semibold text-blue-600 hover:underline cursor-pointer"
                      onClick={() =>
                        router.push(`/seller/${category.categoryslug}/${subcategory.subcategoryslug}`)
                      }
                    >
                      <div className="flex items-center">
                        <Image
                          src={subcategory.icon || "/default-subcategory.png"}
                          alt={subcategory.name}
                          width={24}
                          height={24}
                          className="w-6 h-6"
                          unoptimized
                        />
                        <span className="ml-2">{subcategory.name}</span>
                      </div>
                    </h3>

                    {/* Products */}
                    <ul className="text-gray-700">
                      {subcategory.products.map((product) => (
                        <li key={product._id}>
                          <Link
                            href={`/manufacturers/${encodeURIComponent(product.name.replace(/\s+/g, "-").toLowerCase())}`}
                            className="text-sm text-blue-700 hover:underline"
                          >
                            {product.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
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
