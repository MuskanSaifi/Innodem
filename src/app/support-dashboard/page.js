"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "./dashboard.css";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import AllUsers from "./AllUsers";
import AllProducts from "./AllProducts";
import Buyers from "./Buyers";
import Payments from "./Payments";

import AllContacts from "./AllContacts";
import AllSubscribers from "./AllSubscribers";
import LeadsEnquiry from "./LeadsEnquiry";

function ResponsiveDashboard() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeContent, setActiveContent] = useState("Dashboard");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        const res = await axios.get("/api/support-admins/check-auth");
        if (!res.data.success) {
          router.push("/support-login");
        } else {
          setLoading(false);
        }
      } catch (error) {
        router.push("/support-login");
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
          {activeContent === "All Seller" && <AllUsers />}
          {activeContent === "All Buyers" && <Buyers />}
          {activeContent === "All Subscribers" && <AllSubscribers />}
          {activeContent === "All Contacts" && <AllContacts />}
          {activeContent === "Leads & Enquiry" && <LeadsEnquiry />}
        </div>
      </div>
    </div>
  );
}

export default ResponsiveDashboard;
