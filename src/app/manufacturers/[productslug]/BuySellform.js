"use client"; 
import { useState, useEffect } from "react";

export default function BuySellForm({ product }) {
  const [open, setOpen] = useState(false); // Modal open/close
  const [showForm, setShowForm] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false); // OTP form visibility
  const [user, setUser] = useState(null); // To store user data from localStorage
  const [buySell, setBuySell] = useState("buy");
  const [productname, setProductname] = useState(product.name || "");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setShowForm(false); // Hide form and show product details when closing
    setOpen(false); // Close the modal completely
  };
  const handleContinue = () => setShowForm(true); // Show the form when Continue is clicked
  const handlePrevious = () => setShowForm(false); // Show product details when Previous is clicked

  useEffect(() => {
    // Get user data from localStorage and set it to state
    const storedUser = JSON.parse(localStorage.getItem("user")); // Assuming user is stored in localStorage as a JSON string
    setUser(storedUser);
  }, []);

  const handleOtpSubmit = () => {
    // OTP verification logic here (you may need to add functionality for OTP verification)
    alert("OTP Verified!");
  };

  if (!product) return null; // No product, don't render anything

  return (
    <div>
      {/* Button to Open Modal */}
      <button 
        onClick={handleOpen} 
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition w-full mt-3"
      >
        Purchase {product?.name ? `(${product.name})` : ""}
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-[90%] max-w-lg relative">
            
            {/* Close Button */}
            <button 
              onClick={handleClose} 
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>

            {/* Modal Heading */}
            <h2 className="text-2xl font-bold mb-4 text-center">
              You Are Purchasing
            </h2>

            {/* Show Login Modal if not logged in */}
            {!user && !showOtpForm && (
              <div className="mb-6">
                <p className="text-center text-gray-800 mb-4">Please log in to continue</p>
                <button 
                  onClick={() => alert("Redirect to Login page")} 
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition w-full"
                >
                  Login
                </button>
              </div>
            )}

            {/* Show OTP Form if user is not logged in */}
            {!user && showOtpForm && (
              <div className="mb-6">
                <p className="text-center text-gray-800 mb-4">Please enter your phone number to receive an OTP</p>
                <input 
                  type="text" 
                  placeholder="Enter Phone Number" 
                  className="w-full border rounded px-4 py-2 mb-4"
                />
                <button 
                  onClick={() => setShowOtpForm(true)} 
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition w-full"
                >
                  Send OTP
                </button>
              </div>
            )}

            {/* Show Product Details Section if logged in */}
            {user && !showForm && (
              <div className="mb-6">
                {/* Product Card */}
                <div className="flex items-center gap-4 bg-gray-100 p-4 rounded mb-4">
                  <img 
                    src={product?.images?.[0]?.url || "/placeholder.png"} 
                    alt={product.name} 
                    className="w-16 h-16 object-cover rounded" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
                  />

                  <div className="text-left">
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.companyName || "Company Name"}</p>
                    <p className="text-sm text-gray-600">{product.location || "Location"}</p>
                  </div>
                </div>

                {/* Highlighted Interested Text */}
                <div className="bg-yellow-100 p-4 rounded border text-gray-800">
                  Hi, I am interested in <strong>{product.name}</strong> {product.capacity ? `Capacity: ${product.capacity}` : ""}.
                </div>

                {/* Requirement Frequency */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-1">Requirement Frequency*</label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="requirementFrequency"
                        value="one-time"
                        className="form-radio text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-gray-700">One-Time</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="requirementFrequency"
                        value="recurring"
                        className="form-radio text-orange-500 border-gray-300 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-gray-700">Recurring</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Show Continue Button only when product details are shown */}
            {user && !showForm && (
              <div className="text-center">
                <button 
                  onClick={handleContinue}
                  className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition w-full mt-3"
                >
                  Continue
                </button>
              </div>
            )}

            {/* Show Form after Continue button is clicked */}
            {showForm && (
              <>
                {/* Quantity Input */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Quantity*</label>
                  <input 
                    type="number" 
                    placeholder="1" 
                    className="w-full border rounded px-4 py-2"
                  />
                </div>

                {/* Unit Selection */}
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-1">Unit*</label>
                  <input 
                    type="text" 
                    placeholder="Unit/Units" 
                    className="w-full border rounded px-4 py-2"
                  />
                </div>

                {/* Approximate Order Value */}
                <div className="mb-6">
                  <label className="block text-gray-700 font-medium mb-1">Approx Order Value*</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="INR" 
                      className="flex-1 border rounded px-4 py-2"
                    />
                    <select className="border rounded px-4 py-2">
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="AED">AED</option>
                    </select>
                  </div>
                </div>

                {/* Submit and Previous Buttons */}
                <div className="flex justify-between">
                  <button 
                    onClick={handlePrevious} // When Previous is clicked, show Product Details
                    className="bg-gray-300 text-gray-800 px-6 py-2 rounded hover:bg-gray-400 transition"
                  >
                    Previous
                  </button>
                  <button 
                    onClick={handleClose} // Close the modal completely
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Submit
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
