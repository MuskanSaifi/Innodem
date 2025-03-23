import React, { useEffect, useState } from "react";
import "./dashboard.css";
import axios from "axios";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [userdetail, setUserdetail] = useState(null);

  // ✅ Static values
  const users = 50; // Set a fixed value for users
  const buyers = 103; // Set a fixed value for buyers
  const totalPayments = 0; // Set total payments as static

  useEffect(() => {
    fetchProductsData();  // ✅ Fetch products from user API
    userdata();
  }, []);

  useEffect(() => {
    if (userdetail) {
      setGreetingMessage();
    }
  }, [userdetail]); // ✅ Re-run greeting when `userdetail` updates

  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentTime();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const userdata = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/userprofile/profile/userprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserdetail(response.data.user);
    } catch (error) {
      console.log("Error fetching user data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch total products from user API instead of admin API
  const fetchProductsData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found. User is not authenticated.");
        Swal.fire("Error", "User not authenticated", "error");
        return;
      }
  
      console.log("✅ Token found:", token);
  
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/userprofile/manageproducts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ API Response:", res.data);
  
      if (res?.data?.success && Array.isArray(res?.data?.products)) {
        setProducts(res.data.products.length); // ✅ Store only total count
      } else {
        console.warn("⚠️ No products found or unexpected response.");
        setProducts(0); // ✅ Set to 0 when no products exist
      }
    } catch (error) {
      console.error("❌ Error fetching products data:", error);
      Swal.fire("Error", "Failed to fetch products data", "error");
      setProducts(0); // ✅ Handle errors by showing 0 products
    } finally {
      setLoading(false);
    }
  };
  
  
  

  const setGreetingMessage = () => {
    const currentHour = new Date().getHours();
    const name = userdetail?.fullname || "User";
    
    if (currentHour < 12) {
      setGreeting(`Good Morning, ${name}! ☀️`);
    } else if (currentHour < 18) {
      setGreeting(`Good Afternoon, ${name}! 🌤️`);
    } else {
      setGreeting(`Good Evening, ${name}! 🌙`);
    }
  };

  const updateCurrentTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, 
    });
    setCurrentTime(formattedTime);
  };

  return (
    <>
      <div className="dashboard-content mt-5">
        <div className="container-fluid">
          <div className="row common-shad m-1">
            <div className="col-md-6 mb-3 mt-4">
              <div className="welcome-admin common-shad">
                <h1 className="fs-2 admin fw-bold">{greeting}</h1>
                <div className="row">

                <div className="col-md-6 text-sm">
  <h4 className="text-light text-sm mb-2">
    <b>Current Time:</b> <span className="text-light">{currentTime}</span>
  </h4>
  <p className="fw-bold mt-4 text-light mb-3">Welcome back! Explore your dashboard. 🚀</p>
  <p className="fw-light text-light mb-2">
    Stay updated with your products, orders, and transactions. 📊
  </p>
  <p className="fw-light text-light">
    Keep track of your progress and manage your business efficiently. 💼
  </p>
</div>


                  <div className="col-md-6"></div>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-3 mt-4">
              <div className="row">
                <div className="col-md-6">
                  <div className="resdes-card res-color3 text-light">
                    <h6>Total Users</h6>
                    <p className="fs-1">{users}</p> {/* ✅ Static value */}
                    <span>Total registered users</span>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="resdes-card res-color2 text-light">
                    <h6>Total Buyers</h6>
                    <p className="fs-1">{buyers}</p> {/* ✅ Static value */}
                    <span>Total registered buyers</span>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="resdes-card res-color2 text-light">
                    <h6>Total Products</h6>
                    <p className="fs-1">{loading ? "Loading..." : products}</p> {/* ✅ Ensure this shows count */}
                    <span>Total products available</span>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="resdes-card res-color3 text-light">
                    <h6>Total Payments</h6>
                    <p className="fs-1">{totalPayments}</p> {/* ✅ Static value */}
                    <span>Total payments made</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
