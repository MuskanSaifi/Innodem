"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

const Enquiry = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show one lead per page

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

  // Pagination logic
  const indexOfLastRequest = currentPage * itemsPerPage;
  const indexOfFirstRequest = indexOfLastRequest - itemsPerPage;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);

  const totalPages = Math.ceil(requests.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="container mx-auto p-6">
      {/* ✅ Display total leads count */}
      <div className="text-center text-lg font-semibold text-blue-600 mb-6">
        Total Leads: <span className="text-2xl text-gray-800">{requests.length}</span>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No enquiries found. Please try again later.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-blue-500 text-white text-sm uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Buyer Contact</th>
                <th className="px-6 py-3 text-left">Product Name</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Unit</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {currentRequests.map((req) => (
                <tr key={req._id} className="hover:bg-gray-100 transition-colors duration-200">
                  <td className="px-6 py-4 text-sm font-medium">{req?.buyer?.mobileNumber || "N/A"}</td>
                  <td className="px-6 py-4 text-sm font-medium">{req?.product?.name || "N/A"}</td>
                  <td className="px-6 py-4 text-sm font-medium">{req.quantity}</td>
                  <td className="px-6 py-4 text-sm font-medium">{req.unit}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <span className={`px-3 py-1 text-xs rounded-full ${req.status === 'Pending' ? 'bg-yellow-500 text-white' : req.status === 'Completed' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
      <button
  onClick={handlePrevPage}
  disabled={currentPage === 1}
  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 cursor-pointer disabled:opacity-50"
>
  Previous
</button>
        <span className="text-lg font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
  onClick={handleNextPage}
  disabled={currentPage === totalPages}
  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200 cursor-pointer disabled:opacity-50"
>
  Next
</button>
      </div>
    </div>
  );
};

export default Enquiry;
