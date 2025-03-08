'use client';

import React, { useState } from "react";
import "./dashboard.css";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import CreateProduct from "./CreateProduct";
import CreateSubCategory from "./CreateSubCategory";
import UpdateSubCategory from "./UpdateSubCategory";
import UpdateCategory from "./UpdateCategory";
import CreateCategory from "./CreateCategory";
import AllCategory from "./AllCategory";
import AllUsers from "./AllUsers";
import AllSubcategory from "./AllSubcategory";

function ResponsiveDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeContent, setActiveContent] = useState("Dashboard");

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
          {activeContent === "Create Product" && <CreateProduct />}
          {activeContent === "Create Sub Category" && <CreateSubCategory />}
          {activeContent === "Update Sub Category" && <UpdateSubCategory />}
          {activeContent === "Create Category" && <CreateCategory />}
          {activeContent === "Update Category" && <UpdateCategory />}
          {activeContent === "All Category" && <AllCategory />}
          {activeContent === "All Sub Category" && <AllSubcategory />}
          {activeContent === "All Users" && <AllUsers />}
        </div>
      </div>
    </div>
  );
}

export default ResponsiveDashboard;
