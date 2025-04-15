"use client";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";

const Userprofile = () => {
  const [userdetail, setUserdetail] = useState(null);
  const [loading, setLoading] = useState(true);

  // Access token and user from Redux store
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserdetail(response.data.user);
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 text-lg">Loading user details....</p>
      </div>
    );
  }

  if (!userdetail) {
    return <p className="text-center mt-10 text-red-500">User not found</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white shadow-lg rounded-lg mb-5">
    {/* Profile Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-6">
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-3 sm:mb-0">
        {userdetail.fullname?.charAt(0).toUpperCase()}
      </div>
      <div className="text-center sm:text-left">
        <h2 className="text-lg sm:text-xl font-semibold">{userdetail.fullname}</h2>
        <p className="text-gray-500 text-sm">{userdetail.companyName}</p>
      </div>
    </div>
  
    {/* Personal Details */}
    <div className="border p-4 rounded-lg shadow-sm bg-gray-50">
      <h3 className="text-lg font-semibold mb-4 text-blue-700">Personal Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm font-medium">Email</p>
          <p className="text-gray-900">{userdetail.email}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Alternate Email</p>
          <p className="text-gray-900">{userdetail.alternateEmail || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Office Contact</p>
          <p className="text-gray-900">{userdetail.mobileNumber}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Alternate Mobile No.</p>
          <p className="text-gray-900">{userdetail.alternateMobileNumber || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">WhatsApp Number</p>
          <p className="text-gray-900">{userdetail.whatsappNumber || "N/A"}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium">Designation / Job Title</p>
          <p className="text-gray-900">{userdetail.designation || "N/A"}</p>
        </div>
      </div>
    </div>
  
    {/* Save Button */}
    {/* <div className="mt-6 flex justify-end">
      <button className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
        Save Details
      </button>
    </div> */}
  </div>
  
  );
};

export default Userprofile;
