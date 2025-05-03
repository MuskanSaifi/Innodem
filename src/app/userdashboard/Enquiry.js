"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Enquiry = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?._id;

        if (!userId) {
          console.error("User ID not found in localStorage.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`/api/userprofile/leadandwnquiry/recieveenquiry/${userId}`);
        setRequests(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching requests", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
<div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Leads</h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">Enquiries not found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 shadow-lg rounded-lg">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Buyer Contact</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Product Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Quantity</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Unit</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {requests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{req?.buyer?.mobileNumber || "N/A"}</td>
                  <td className="px-6 py-4 text-sm">{req?.product?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm">{req.quantity}</td>
                  <td className="px-6 py-4 text-sm">{req.unit}</td>
                  <td className="px-6 py-4 text-sm">{req.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Enquiry;
