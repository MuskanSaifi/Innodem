"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BankDetails = () => {
  const [formData, setFormData] = useState({
    accountType: "",
    accountHolderName: "",
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    mobileLinked: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch Bank Details
  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, user not authenticated");
          return;
        }

        const response = await axios.get(`api/userprofile/profile/bankdetails`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success && response.data.data) {
          setFormData(response.data.data);
        } else {
          console.error("Error fetching bank details:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching bank details:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("User not authenticated");

      const response = await axios.patch(`/api/userprofile/profile/bankdetails`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Bank details updated successfully!");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error updating bank details:", error.response?.data?.message || error.message);
      alert("Failed to update bank details.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Bank Details</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Account Type</label>
              <select className="form-control" name="accountType" value={formData.accountType} onChange={handleChange}>
                <option value="">Select Account Type</option>
                <option value="Saving">Saving</option>
                <option value="Current">Current</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Account Holder Name</label>
              <input type="text" className="form-control" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Account Number</label>
              <input type="text" className="form-control" name="accountNumber" value={formData.accountNumber} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Account Number</label>
              <input type="text" className="form-control" name="confirmAccountNumber" value={formData.confirmAccountNumber} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">IFSC Code</label>
              <input type="text" className="form-control" name="ifscCode" value={formData.ifscCode} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Mobile Linked to Account</label>
              <input type="text" className="form-control" name="mobileLinked" value={formData.mobileLinked} onChange={handleChange} />
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary w-100">Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BankDetails;
