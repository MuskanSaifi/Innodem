"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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

  return (
    <header className="bg-light shadow-sm">
      <div className="container-fluid p-2 text-center top-bar text-dark">
        <p className="mb-0">
          Due to the COVID-19 epidemic, orders may be processed with a slight delay
        </p>
      </div>

      <div className="container d-flex align-items-center justify-content-between py-3">
        {/* Logo */}
        <Link href="./">
          <img
            src="https://www.digitalexportsmarketing.com/assets/images/logo/Innodem%20logo.png"
            className="img-fluid"
            alt="Innodem Logo"
            style={{ height: "50px" }}
          />
        </Link>

        {/* Search Bar */}
        <div className="flex-grow-1 mx-3">
          <input className="form-control" type="text" placeholder="Search" />
        </div>

        {/* User Section with Dropdown */}
        <div className="d-flex align-items-center">
          {user ? (
            <div className="dropdown2" ref={dropdownRef}>
              <button
                className=" dropdown-toggle"
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
