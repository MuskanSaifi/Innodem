"use client";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";

const Userprofile = () => {
  const [userdetail, setUserdetail] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const token = useSelector((state) => state.user.token);

  useEffect(() => {
    userdata();
  }, [token]);

  const userdata = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/userprofile/profile/userprofile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserdetail(response.data.user);
      setFormData(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await axios.patch(`/api/userprofile/profile/userprofile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setUserdetail(response.data.user);
      setEditMode(false);
    } catch (error) {
      console.error("Error saving user data:", error.response?.data || error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 text-lg">Loading user details...</p>
      </div>
    );
  }

  if (!userdetail) {
    return <p className="text-center mt-10 text-red-500">User not found</p>;
  }

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4 ">
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl border border-gray-200 transition-all hover:shadow-lg">

        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 px-4 py-2 mb-2 bg-white rounded-lg shadow-md border border-gray-200">
  {/* Profile Circle */}
  <div className="w-16 m-auto h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow ring-2 ring-blue-300">
    {userdetail.fullname?.charAt(0).toUpperCase()}
  </div>

  {/* Name and Company Info */}
  <div className="flex-1 m-2 sm:mt-0 text-center sm:text-left">
    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{userdetail.fullname}</h2>
    <p className="text-gray-500 text-sm m-0">{userdetail.companyName}</p>
  </div>

  {/* Profile Link */}
  <div className="m-auto">
    <Link
      href={userdetail.userProfileSlug ? `/company/${userdetail.userProfileSlug}` : "#"}
      className="inline-block text-sm sm:text-base bg-blue-100 text-blue-700 font-medium px-4 py-2 rounded-full shadow-sm hover:bg-blue-200 transition"
    >
      {userdetail.userProfileSlug
        ? `dialexportmart.com/company/${userdetail.userProfileSlug}`
        : "N/A"}
    </Link>
  </div>
</div>



        {/* Personal Details */}
        <div className="border p-3 rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Personal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: "Email", name: "email" },
              { label: "Alternate Email", name: "alternateEmail" },
              { label: "Office Contact", name: "mobileNumber" },
              { label: "Alternate Mobile No.", name: "alternateMobileNumber" },
              { label: "WhatsApp Number", name: "whatsappNumber" },
              { label: "Designation / Job Title", name: "designation" },
              { label: "Company Name", name: "companyName" },
            ].map(({ label, name }) => (
              <div key={name}>
                <p className="text-gray-500 text-sm font-medium">{label}</p>
                {editMode ? (
                  <input
                    type="text"
                    name={name}
                    value={formData[name] || ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-100 rounded-md px-3 py-2 transition-all"
                  />
                ) : (
                  <p className="text-gray-900">{userdetail[name] || "N/A"}</p>
                )}
              </div>
            ))}

          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-3">
          {editMode ? (
            <>
              <button
                className="px-5 py-2 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 transform hover:scale-105 transition-all"
                onClick={() => setEditMode(false)}
                disabled={saving}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transform hover:scale-105 transition-all"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Details"}
              </button>
            </>
          ) : (
            <button
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transform hover:scale-105 transition-all"
              onClick={() => setEditMode(true)}
            >
              Edit Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Userprofile;
