"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiChevronDown,
  FiChevronUp,
  FiBriefcase,
  FiMapPin,
  FiFileText,
} from "react-icons/fi";

const BusinessProfile = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    officeContact: "",
    faxNumber: "",
    address: "",
    pincode: "",
    city: "",
    state: "",
    country: "India",
    gstNumber: "",
    panNumber: "",
  });

  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState("companyDetails");

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("/api/userprofile/profile/businessprofile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success && res.data.data) {
          setFormData(res.data.data);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSection = (section) => {
    setOpenSection(openSection === section ? null : section);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Please login again");

      const res = await axios.patch(
        "/api/userprofile/profile/businessprofile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        toast.success("Business profile updated!");
      } else {
        toast.error("Update failed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong!");
    }
  };
  const renderSection = (key, label, Icon, content) => (
    <div className="mb-3">
      <button
        type="button"
        className={`btn w-100 common-das-test text-start d-flex justify-content-between align-items-center fw-semibold fs-5 border ${
          openSection === key ? "common-das-background text-white" : "btn-outline-primary"
        }`}
        onClick={() => toggleSection(key)}
      >
        <span className="d-flex align-items-center">
          <Icon className="me-2" size={20} />
          {label}
        </span>
        {openSection === key ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
      </button>
      {openSection === key && (
        <div className="bg-light border border-primary-subtle rounded p-4 mt-2 shadow-sm">
          {content}
        </div>
      )}
    </div>
  );
  

  return (
    <div className="container mt-5 mb-5">
      <div className=" shadow-lg p-4 rounded-4 border-0">
        <h2 className="title">Business <span>Profile</span></h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status" />
            <p className="mt-3">Loading profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            {/* Company Details */}
            {renderSection("companyDetails", "Company Details", FiBriefcase, (
              <>
                <label className="form-label">Company Name</label>
                <input type="text" className="form-control" name="companyName" value={formData.companyName} readOnly />

                <label className="form-label mt-3">Office Contact</label>
                <input type="text" className="form-control" name="officeContact" value={formData.officeContact} onChange={handleChange} />

                <label className="form-label mt-3">Fax Number</label>
                <input type="text" className="form-control" name="faxNumber" value={formData.faxNumber} onChange={handleChange} />
              </>
            ))}

            {/* Address Details */}
            {renderSection("addressDetails", "Address Details", FiMapPin, (
              <>
                <label className="form-label">Address</label>
                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />

                <label className="form-label mt-3">Pincode</label>
                <input type="text" className="form-control" name="pincode" value={formData.pincode} onChange={handleChange} />

                <label className="form-label mt-3">City</label>
                <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} />

                <label className="form-label mt-3">State</label>
                <input type="text" className="form-control" name="state" value={formData.state} onChange={handleChange} />

                <label className="form-label mt-3">Country</label>
                <input type="text" className="form-control" name="country" value={formData.country} readOnly />
              </>
            ))}

            {/* Taxation Details */}
            {renderSection("taxationDetails", "Taxation Details", FiFileText, (
              <>
                <label className="form-label">GST Number</label>
                <input type="text" className="form-control" name="gstNumber" value={formData.gstNumber} onChange={handleChange} />

                <label className="form-label mt-3">PAN Number</label>
                <input type="text" className="form-control" name="panNumber" value={formData.panNumber} onChange={handleChange} />
              </>
            ))}

            <div className="text-center mt-4">
              <button type="submit" className=" common-das-btn w-100 py-2 fw-semibold fs-5 text-light shadow-sm">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BusinessProfile;
