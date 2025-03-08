"use client"; // ✅ Ensure this is a Client Component

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCategories } from "../app/store/categorySlice"; // ✅ Corrected Import Path

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

const LayoutWrapper = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  useEffect(() => {
    dispatch(fetchCategories()); // ✅ Fetch categories once when the component mounts
  }, [dispatch]);

  return (
    <>
      {/* ✅ Show Header except on certain pages */}
      {pathname !== "/about" &&
      pathname !== "/dashboard" &&
      pathname !== "/about/aboutstudent" &&
      pathname !== "/about/aboutcollege" ? (
        <Header />
      ) : (
        <p>About Common Layout</p>
      )}

      {children} {/* ✅ Render children inside layout */}

      {/* ✅ Hide Footer only on /userdashboard */}
      {pathname !== "/userdashboard" && <Footer />}
    </>
  );
};

export default LayoutWrapper;
