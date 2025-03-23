"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        searchRef.current && !searchRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  // ✅ Fetch suggestions from API when the user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(`/api/adminprofile/seller`);
        const data = await response.json();
        if (response.ok) {
          // ✅ Filter products by name
          const filtered = data.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSuggestions(filtered);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300); // ⏳ Debounce API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleSearchSelect = (product) => {
    const formatUrl = (name) =>
      encodeURIComponent(name.replace(/&/g, "and").replace(/\s+/g, "-").toLowerCase());
  
    const categoryName = product.category?.name || "unknown";
    const subCategoryName = product.subCategory?.name || "general";
    const productName = formatUrl(product.name);
  
    setSearchTerm(product.name);
    setSuggestions([]);
    router.push(`/${formatUrl(categoryName)}/${formatUrl(subCategoryName)}/${productName}`);
  };

  return (
    <header className="bg-light shadow-sm">
      <div className="container-fluid p-2 text-center top-bar text-dark">
        <p className="mb-0">
          Due to the COVID-19 epidemic, orders may be processed with a slight delay
        </p>
      </div>

      <div className="container d-flex align-items-center justify-content-between py-3">

        {/* Logo */}
        <Link href="/">
  <img
    src="/assets/logo.png"  // ✅ Correct path
    className="img-fluid"
    alt="Innodem Logo"
    style={{ height: "60px" }}
  />
        </Link>

        {/* ✅ Search Bar with Suggestions */}
        <div className="position-relative flex-grow-1 mx-3" ref={searchRef}>
          <input
            className="form-control w-50"
            type="text"
            placeholder="Search for products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100 shadow-sm bg-white text-sm">
              {suggestions.map((product) => (
                <li
                  key={product._id}
                  className="list-group-item list-group-item-action cursor-pointer"
                  onClick={() => handleSearchSelect(product)}
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* User Section with Dropdown */}
        <div className="d-flex align-items-center">
          {user ? (
            <div className="dropdown2" ref={dropdownRef}>
              <button
                className="dropdown-toggle"
                type="button"
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
              >
                👤 Hi! {user.fullname || "User"}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu show">
                  <li className="dropdown-header text-center fw-bold">Welcome!</li>
                  <li><Link className="dropdown-item" href="/userdashboard">Dashboard</Link></li>
                  <li><Link className="dropdown-item" href="/profile">Profile</Link></li>
                  <li><Link className="dropdown-item" href="/inquiries">Inquiries</Link></li>
                  <li><Link className="dropdown-item" href="/buy-leads">Buy Leads</Link></li>
                  <li><Link className="dropdown-item" href="/membership">My Membership</Link></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      Sign Out
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <>
              <Link className="btn btn-outline-primary me-2" href="/user/login">
                Login
              </Link>
              <Link className="btn btn-primary" href="/user/register">
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}
