'use client';

import React, { useState } from "react";
import "./dashboard.css";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Userprofile from "./Userprofile";
import BusinessProfile from "./Businessprofile"; // ✅ Corrected import
import BankDetails from "./Bankdetails";
import AddProducts from "./Addproducts";
import AllProducts from "./Allproducts";
import Payments from "./Payments";
import Enquiry from "./Enquiry";

function UserDashboard() {
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
          <h1 className="text-lg mb-0">{activeContent}</h1>
        </div>
        <div className="resdes-dynamic-content">
          {activeContent === "Dashboard" && <Dashboard/>}
          {activeContent === "Payments" && <Payments/>}
          {activeContent === "User Profile" && <Userprofile/>}
          {activeContent === "Business Profile" && <BusinessProfile />}
          {activeContent === "Bank Details" && <BankDetails />}
          {activeContent === "Add New Product" && <AddProducts />}
          {activeContent === "My Product" && <AllProducts />}
          {activeContent === "Recieved Enquiry" && <Enquiry />}
        </div> 
      </div>
    </div>
  );
}

export default UserDashboard;
