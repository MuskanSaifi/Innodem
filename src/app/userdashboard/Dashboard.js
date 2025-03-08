import React from "react";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <>
    <div className="dashboard-content">
      <div className="container-fluid">
      <div className="row">
        <div className="col-md-6 mb-3"></div>
        <div className="col-md-6 mb-3">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="resdes-card res-color text-light">
                <h6>Total Users</h6>
                <p className="fs-1">0</p>
                <span>Total registered users</span>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="resdes-card res-color2 text-light">
                <h6>Total Products</h6>
                <p className="fs-1">0</p>
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
