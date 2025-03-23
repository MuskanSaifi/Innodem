import React, { useEffect, useState } from "react";
import "./dashboard.css";
import axios from "axios";
import Swal from "sweetalert2";

const Dashboard = () => {
  const [users, setUsers] = useState(null);
  const [buyers, setBuyers] = useState(null);
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");


  useEffect(() => {
    fetchDashboardData();
    setGreetingMessage();

    // ✅ Update time every second
    const interval = setInterval(() => {
      updateCurrentTime();
    }, 1000);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);


  const fetchDashboardData = async () => {
    try {
      const [usersRes, buyersRes, productsRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/users`),
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/buyers`),
        axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/adminprofile/products`),
      ]);

      // ✅ Update states only after all requests complete
      setUsers(usersRes.data?.success ? usersRes.data.totalUsers || 0 : 0);
      setBuyers(buyersRes.data?.success ? buyersRes.data.totalBuyers || 0 : 0);
      setProducts(productsRes.data?.success ? productsRes.data.totalProducts || 0 : 0);
      
    } catch (error) {
      console.error("❌ Error fetching dashboard data:", error);
      Swal.fire("Error", "Failed to fetch dashboard data", "error");
      setUsers(0);
      setBuyers(0);
      setProducts(0);
    } finally {
      setLoading(false);
    }
  };


  const setGreetingMessage = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning, Admin! ☀️");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon, Admin! 🌤️");
    } else {
      setGreeting("Good Evening, Admin! 🌙");
    }
  };


  const updateCurrentTime = () => {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Change to false for 24-hour format
    });
    setCurrentTime(formattedTime);
  };

  return (
    <>
      <div className="dashboard-content mt-5">

        <div className="container-fluid">
          <div className="row common-shad m-1">
      <h4 className="text-secondary mt-3">Current Time: {currentTime}</h4>
            <div className="col-md-6 mb-3 mt-4 ">
              <div className="welcome-admin common-shad">
                <h1 className="fs-2 admin fw-bold">{greeting}</h1>
                <div className="row">
                  <div className="col-md-8 text-sm">
                  <p class="fw-bold mt-2">Welcome back, Admin! Keep leading with excellence. 🚀</p>
                  <p class="fw-light">Every click you make improves the user experience. Stay ahead! 🎯</p>
                  <p class="fw-light">A well-managed system is a step toward a thriving business. Keep optimizing! 🔥</p>
                  <p class="fw-light">Your decisions shape the success of this platform. Keep it up! 💪</p>

                  </div>
                  <div className="col-md-4"></div>
                </div>
              

              </div>
            </div>
            <div className="col-md-6 mb-3 mt-4">
              <div className="row">
                <div className="col-md-6">
                  <div className="resdes-card res-color3 text-light">
                    <h6>Total Seller</h6>
                    <p className="fs-1">{loading ? "Loading..." : users}</p>
                    <span>Total registered </span>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="resdes-card res-color2 text-light">
                    <h6>Total Buyers</h6>
                    <p className="fs-1">{loading ? "Loading..." : buyers}</p>
                    <span>Total registered buyers</span>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="resdes-card res-color2 text-light">
                    <h6>Total Products</h6>
                    <p className="fs-1">{loading ? "Loading..." : products}</p>
                    <span>Total products available</span>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="resdes-card res-color3 text-light">
                    <h6>Total Payments</h6>
                    <p className="fs-1">0</p>
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
