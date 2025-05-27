"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaChevronDown, FaSearch, FaMapMarkerAlt, FaTh  } from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";

import { logout, initializeUser } from "@/app/store/userSlice";
import SmoothCounter from "./Counter";


export default function Header() {
  // const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All City");
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenpopup, setIsOpenpopup] = useState(false);

  const togglepopup = () => {
    setIsOpenpopup(!isOpenpopup);
  };

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const toggleDrawer2 = (path) => {
    setIsOpen(false); // Close drawer
    router.push(path); // Navigate
  };

  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const cityDropdownRef = useRef(null);
  const router = useRouter();

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [cities, setCities] = useState(["All City"]); // Store cities from API
  
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await fetch("/api/registeredusers"); // replace with your actual API route
        const data = await res.json();
        if (data.success) {
          setTotalUsers(data.totalUsers);
        }
      } catch (err) {
        console.error("Failed to fetch total users:", err);
      }
    };

    fetchTotalUsers();
  }, []);


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
    dispatch(initializeUser()); // LocalStorage se data load karein
  }, [dispatch]);


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
    dispatch(logout());
    router.push("/");
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

    // const categoryName = product.category?.name || "unknown";
    // const subCategoryName = product.subCategory?.name || "general";
    const productName = formatUrl(product.name);

    setSearchTerm(product.name);
    setSuggestions([]);
    // router.push(`/${formatUrl(categoryName)}/${formatUrl(subCategoryName)}/${productName}`);
    // router.push(`/manufacturers/${productName}`);
    router.push(`/manufacturers/${product.productslug}`);
  };

  const directoryLinks = [
    { label: "Become a Member", href: "/become-a-member" },
    { label: "About Us", href: "/about-us" },
    { label: "What We Do", href: "/what-we-do" },
    { label: "Join Us", href: "/user/register" },
    { label: "Blogs", href: "/blogs" },
  ];
  
  const helpLinks = [
    { label: "Contact Us", href: "/contact-us" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund Policy", href: "/refund-policy" },
    { label: "Terms of Use", href: "/terms-of-use" },
  ];



  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
      setError("");
  
      try {
        const fullMobileNumber = `${countryCode.value}${mobileNumber.replace(/\s/g, "")}`;
        const apiUrl = buySell === "buy" ? "/api/auth/sendotpbuyer" : "/api/auth/sendotp";
        const requestBody = {
          fullname,
        email,
        mobileNumber: fullMobileNumber,
        countryCode: countryCode.value,
        productname, // Added product name
        };
        
        if (buySell === "sell") {
          requestBody.companyName = companyName;
          requestBody.pincode = pincode;
          requestBody.productname = productname;
          requestBody.fullname = fullname;
          requestBody.email = email;
          requestBody.mobileNumber = fullMobileNumber;
        }
  
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message);
          setOtpSent(true);
        } else {
          setError(data.error || "Unexpected error occurred.");
        }
      } catch (err) {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
  
    const handleOtpVerify = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
      setError("");
    
      try {
        const fullMobileNumber = `${countryCode.value}${mobileNumber.replace(/\s/g, "")}`;
        const apiUrl = buySell === "buy" 
          ? "/api/auth/verifyotpbuyer" 
          : `/api/auth/verifyotp`; // Seller API
    
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: fullMobileNumber, otp }),
        });
    
        const data = await res.json();
        if (res.ok) {
          setMessage("OTP verified successfully!");
    
          if (buySell === "sell") {
           // Redux store update karen
           dispatch(setUser({ user: data.user, token: data.token }));
            router.push("/userdashboard");
          } else {
            toast.success("verified")
          }
          setShowModal(false);
        } else {
          setError(data.error || "Invalid OTP. Please try again.");
        }
      } catch (err) {
        setError("Invalid OTP or something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    
  return (
    <>
  <header className="bg-light shadow-sm Main-header">

  <div className="container-fluid p-2 text-center top-bar text-dark">
  <marquee behavior="scroll" direction="left" scrollamount="6">
  <p className="mb-0 text-light text-sm">
    We connect you with verified export buyers within 24 hours, guaranteed genuine and confirmed conversations with buyers.
  </p>
</marquee>
  </div>


  {isOpenpopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-6xl  relative">

          <div className="container-fluid">
      {/* Main Branding */}
      <div className="bg-gradient-to-r from-purple-100 to-purple-200 rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-center">
        <h2 className="text-2xl font-bold text-purple-700">Dial Export Mart</h2>
        <p className="mt-2 text-sm text-gray-600">Your trusted B2B marketplace partner</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mt-10">
        {/* Branding (Again?) */}
<div className="bg-purple-100 rounded-xl shadow-lg p-1 w-full md:w-1/3 text-center">
  <Image
    src="/assets/banner-menu-pop.png" // Replace with your image path (can be from /public)
    alt="Dial Export Mart"
    width={465}
    height={310}
    className="mx-auto rounded-lg" // Optional: styling like centering and rounded corners
  />
</div>

        {/* Directory */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full md:w-1/3">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center gap-2">📚 Directory</h3>
          <ul className="space-y-3 text-sm text-gray-700">
  {directoryLinks.map((item) => (
    <li key={item.href}>
      <button
        onClick={() => {
          setIsOpenpopup(false);
          router.push(item.href);
        }}
        className="hover:text-purple-600 flex items-center gap-2 w-full text-left"
      >
        🔹 {item.label}
      </button>
    </li>
  ))}
</ul>
        </div>

        {/* Help & Support */}
        <div className="bg-white rounded-xl shadow-lg p-6 w-full md:w-1/3">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2 flex items-center gap-2">🛠️ Help & Support</h3>
          <ul className="space-y-3 text-sm text-gray-700">
  {helpLinks.map((item) => (
    <li key={item.href}>
      <button
        onClick={() => {
          setIsOpenpopup(false);
          router.push(item.href);
        }}
        className="hover:text-purple-600 flex items-center gap-2 w-full text-left"
      >
        🔹 {item.label}
      </button>
    </li>
  ))}
</ul>

        </div>
      </div>
    </div>

            <button
              className="absolute top-2 right-2 text-xl font-bold text-gray-500 hover:text-gray-800"
              onClick={togglepopup}
            >
              &times;
            </button>
          </div>
        </div>
      )}



  <div className="container-fluid py-3">
    <div className="row align-items-center">
      {/* Logo Section */}
      <div className="col-3 col-md-2 d-flex justify-content-center">
        <Link href="/">
          <Image
            src="/assets/logo123.png"
            alt="Innodem Logo"
            width={160}
            height={60}
            className="img-fluid"
          />
        </Link>
      </div>
   
      {/* Search Bar Section */}
      <div className="col-7 col-md-8">
        <div className="d-flex align-items-center justify-content-between">
        <button className="text-4xl p-2 rounded me-3 d-none-mob"
        onClick={togglepopup}>
        <FaTh />
      </button>
  
          {/* City Dropdown Search */}
          <div className="relative d-none-mob" ref={cityDropdownRef}>
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
                            className="w-full text-left ps-2 p-1 hover:bg-gray-100"
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

          {/* Product Search */}
          <div className="position-relative flex-grow-1 pro-ser-div" ref={searchRef}>
            <input
              className="product-search form-control"
              type="text"
              placeholder="🔍 Search products..."
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

          {/* Registered Users */}
          <div className="registered-users-box text-center d-none-mob">
            <h3>Registered Users</h3>
          <p>  <SmoothCounter end={totalUsers+118000} duration={2} /></p> 
            </div>
        </div>
      </div>

      {/* User Sections */}
      <div className="col-2 d-flex justify-content-end">

<div className="d-none-mob mr-auto">
        {user ? (
          <div className="dropdown2" ref={dropdownRef}>
            <button
              className="dropdown-toggle"
              type="button"
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
<Image 
  src="/assets/dashboardicons/profile1.png"  // or external URL if allowed
  alt="Description of image"
  className="d-inline"
  width={40}
  height={40}
/>
Hi! {user.fullname || "User"}
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
                    🧑 Profile
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
          <div className="d-none-mob">
            <Link className="btn btn-outline-primary me-2" href="/user/login">
              Login
            </Link>
            <Link className="btn btn-primary" href="/user/register">
              Sign Up
            </Link>
          </div>
          </>
        )}
</div>


<div className="d-none-web">
<div>
      {/* Button to open the drawer */}
      <button
        className="bg-grey-500 text-white px-3 text-2xl py-2 rounded-2 common-shad  d-none-web"
        onClick={toggleDrawer}
      >
      👨‍💼
      </button>

      {/* Bottom Drawer */}
      <div
        className={`fixed bottom-0 bottom-drawer  left-0 w-full bg-white shadow-lg transition-transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "60vh" }}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <h4 className="text-lg font-semibold mb-0"> {user ? <span style={{color:"#6d4aae"}}>👤 Hi! {user.fullname || "User"}</span> : "Welcome Guest"} </h4>
          <button className="text-gray-600" onClick={toggleDrawer}>
            ✖
          </button>
        </div>

        {/* Drawer Content */}
        <div className="p-4">
          {user ? ( <>
            👋 Welcome!
          
          <ul className="mt-4 space-y-2">
                <li>
                  <Link className="dropdown-item" href="/userdashboard">
                    🏠 Dashboard
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" href="/profile">
                    🧑 Profile
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
          </> ) : 

          <>
            <p>Welcome! Guest</p>
            <div className="mt-6 flex justify-between">
    <button
      onClick={() => toggleDrawer2("/user/login")}
      className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg"
    >
      Login
    </button>

    <button
      onClick={() => toggleDrawer2("/user/register")}
      className="bg-blue-500 text-white px-4 py-2 rounded-lg"
    >
      Sign Up
    </button>
  </div>
          </> 
          }
          <p className="mt-4 text-center text-sm text-gray-500">
            Registered Users: <span className="text-green-600">    <SmoothCounter end={totalUsers+350000} duration={2} /></span>
          </p>
        </div>
      </div>
    </div>

</div>
      </div>
    </div>
  </div>
</header>

    </>
  );
}
