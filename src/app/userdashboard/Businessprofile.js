"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const BusinessProfile = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    officeContact: "",
    faxNumber: "",
    ownershipType: "",
    annualTurnover: "",
    yearOfEstablishment: "",
    numberOfEmployees: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
    gstNumber: "",
    panNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState("companyDetails"); // Default Open Tab

  // Fetch Business Profile
  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found, user not authenticated");
          return;
        }

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/userprofile/profile/businessprofile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.success && response.data.data) {
          setFormData(response.data.data);
        } else {
          console.error("Error fetching business profile:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || "",
    }));
  };

  // Handle Section Toggle
  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  // Handle Save (Prevent Page Reload & Save Data)
  const handleSave = async (e) => {
    e.preventDefault(); // Prevent page refresh

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication failed. Please log in again.");
        return;
      }

      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/userprofile/profile/businessprofile`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Business Profile Updated Successfully!");
      } else {
        toast.error("Failed to update profile. Try again.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <h2 className="text-center mb-4">Business Profile</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSave}>
            {/* Company Details Section (Default Open) */}
            <div className="mb-3">
              <button
                type="button"
                className={`btn w-100 text-start ${openSection === "companyDetails" ? "btn-success" : "btn-danger"}`}
                onClick={() => toggleSection("companyDetails")}
              >
                <strong>Company Details</strong> {openSection === "companyDetails" ? "▲" : "▼"}
              </button>
              {openSection === "companyDetails" && (
                <div className="p-3 border rounded mt-2">
                  <label className="form-label">Company Name</label>
                  <input type="text" className="form-control" name="companyName" value={formData.companyName} readOnly />

                  <label className="form-label mt-2">Office Contact</label>
                  <input type="text" className="form-control" name="officeContact" value={formData.officeContact} onChange={handleChange} />

                  <label className="form-label mt-2">Fax Number</label>
                  <input type="text" className="form-control" name="faxNumber" value={formData.faxNumber} onChange={handleChange} />
                </div>
              )}
            </div>

            {/* Address Details Section */}
            <div className="mb-3">
              <button
                type="button"
                className={`btn w-100 text-start ${openSection === "addressDetails" ? "btn-success" : "btn-danger"}`}
                onClick={() => toggleSection("addressDetails")}
              >
                <strong>Address Details</strong> {openSection === "addressDetails" ? "▲" : "▼"}
              </button>
              {openSection === "addressDetails" && (
                <div className="p-3 border rounded mt-2">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />

                  <label className="form-label mt-2">Pincode</label>
                  <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleChange} />

                  <label className="form-label mt-2">City</label>
                  <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} />
                </div>
              )}
            </div>

            {/* Taxation Details Section */}
            <div className="mb-3">
              <button
                type="button"
                className={`btn w-100 text-start ${openSection === "taxationDetails" ? "btn-success" : "btn-danger"}`}
                onClick={() => toggleSection("taxationDetails")}
              >
                <strong>Taxation Details</strong> {openSection === "taxationDetails" ? "▲" : "▼"}
              </button>
              {openSection === "taxationDetails" && (
                <div className="p-3 border rounded mt-2">
                  <label className="form-label">GST Number</label>
                  <input type="text" className="form-control" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />

                  <label className="form-label mt-2">PAN Number</label>
                  <input type="text" className="form-control" name="panNumber" value={formData.panNumber} onChange={handleChange} />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="text-center mt-4">
              <button type="submit" className="btn btn-primary px-4 w-100">Save</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessProfile;
