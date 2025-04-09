"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./dashboard.css";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import CreateSubCategory from "./CreateSubCategory";
import UpdateSubCategory from "./UpdateSubCategory";
import UpdateCategory from "./UpdateCategory";
import CreateCategory from "./CreateCategory";
import AllCategory from "./AllCategory";
import AllUsers from "./AllUsers";
import AllSubcategory from "./AllSubcategory";
import AllProducts from "./AllProducts";
import Buyers from "./Buyers";
import Payments from "./Payments";
import AllBlogs from "./AllBlogs";
import CreateBlog from "./CreateBlog";
import AllSubscribers from "./AllSubscribers";

function ResponsiveDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeContent, setActiveContent] = useState("Dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const res = await axios.get("/api/admin/check-auth");
        if (!res.data.success) {
          router.push("/admin-login");
        } else {
          setLoading(false);
        }
      } catch (error) {
        router.push("/admin-login");
      }
    };

    checkAdminAuth();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="resdes-dashboard">
      <Sidebar isSidebarOpen={isSidebarOpen} setActiveContent={setActiveContent} activeContent={activeContent} />

      <div className={`resdes-content ${isSidebarOpen ? "resdes-shrink" : "resdes-expand"}`}>
        <div className="resdes-header">
          <button onClick={toggleSidebar} className="resdes-hamburger" aria-label="Toggle Sidebar">
            &#9776;
          </button>
          <h1>{activeContent}</h1>
        </div>

        <div className="resdes-dynamic-content">
          {activeContent === "Dashboard" && <Dashboard />}
          {activeContent === "Payments" && <Payments />}
          {activeContent === "All Products" && <AllProducts />}
          {activeContent === "Create Sub Category" && <CreateSubCategory />}
          {activeContent === "Update Sub Category" && <UpdateSubCategory />}
          {activeContent === "Create Category" && <CreateCategory />}
          {activeContent === "Update Category" && <UpdateCategory />}
          {activeContent === "All Category" && <AllCategory />}
          {activeContent === "All Sub Category" && <AllSubcategory />}
          {activeContent === "All Users" && <AllUsers />}
          {activeContent === "All Buyers" && <Buyers />}
          {activeContent === "All Blogs" && <AllBlogs />}
          {activeContent === "Create Blogs" && <CreateBlog />}
          {activeContent === "All Subscribers" && <AllSubscribers />}
        </div>
      </div>
    </div>
  );
}

export default ResponsiveDashboard;
