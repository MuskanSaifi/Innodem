"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronDown, FaSearch, FaMapMarkerAlt } from "react-icons/fa";


export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All City");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const router = useRouter();

  const [cities, setCities] = useState(["All City"]); // Store cities from API


  useEffect(() => {
    // Fetch all cities dynamically from the API
    async function fetchCities() {
      try {
        const response = await fetch("/api/location/allheadercity");
        const data = await response.json();
        if (response.ok) {
          setCities(["All City", ...data.cities]); // Include "All City" at the start
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    }
    fetchCities();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)
      ) {
        setCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
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

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]); // Immediately clear suggestions when empty
      return;
    }
  
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(`/api/adminprofile/seller`);
        const data = await response.json();
        if (response.ok) {
          const filtered = data.filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setSuggestions(filtered);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    const delayDebounceFn = setTimeout(fetchSuggestions, 300);
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
    <>
    <header className="bg-light shadow-sm Main-header">
      <div className="container-fluid p-2 text-center top-bar text-dark">
        <p className="mb-0">
        We connect you with verified export buyers within 24 hours, guaranteeing confirmed deals.
        </p>
      </div>

      <div className="container d-flex align-items-center justify-content-between py-3">
        
        {/* Logo */}
        <Link href="/">
          <Image
          src="/assets/logo.png"
          alt="Innodem Logo"
          width={120} // Adjust width as needed
          height={60} // Adjust height as needed
          className="img-fluid"
        />
      </Link>

      
        {/* 🔍 City Dropdown Search */}
        <div className="relative  ml-10" ref={cityDropdownRef}>
          <button
            className="flex items-center gap-2 city-search border rounded-lg bg-white shadow-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
          >
            <FaMapMarkerAlt className="text-gray-500" />
            {selectedCity}
            <FaChevronDown className="text-gray-500" />
          </button>

          {cityDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50">
              <div className="flex items-center px-3 py-2 border-b">
                <FaSearch className="text-gray-400" />
                <input
                  type="text"
                  className="w-full px-2 py-1 outline-none"
                  placeholder="Search City..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                />
              </div>
              <ul className="max-h-60 overflow-y-auto">
  {cities?.length > 0 ? (
    cities
      .filter((city) =>
        city.toLowerCase().includes(citySearch.toLowerCase())
      )
      .map((city, index) => (
        <li key={index}>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100"
            onClick={() => router.push(`/city/${city}`)}
          >
            {city}
          </button>
        </li>
      ))
  ) : (
    <p className="text-gray-500 px-4 py-2">No cities found</p>
  )}
</ul>


            </div>
          )}
        </div>


        {/* ✅ New Product Search Bar with Suggestions */}
        <div className="position-relative flex-grow-1 mx-3 product-search-input" ref={searchRef}>
          <input
            className="product-search"
            type="text"
            placeholder="📦 Search for products..."
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
  <div className="registered-users-box">
  <h3>Registered Users</h3>
  <p>1,11,48,647</p>
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
        <li className="dropdown-header text-center fw-bold">👋 Welcome!</li>
        <li>
          <Link className="dropdown-item" href="/userdashboard">
            🏠 Dashboard
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/profile">
            🧑‍💼 Profile
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/inquiries">
            📩 Inquiries
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/buy-leads">
            🛒 Buy Leads
          </Link>
        </li>
        <li>
          <Link className="dropdown-item" href="/membership">
            🎟️ My Membership
          </Link>
        </li>
        <li>
          <button className="dropdown-item text-danger" onClick={handleLogout}>
            🚪 Sign Out
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
    </>
  );
}
