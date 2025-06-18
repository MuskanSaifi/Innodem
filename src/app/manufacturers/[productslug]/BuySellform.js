"use client"; 
import { useState, useEffect } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import Image from "next/image";

const countryCodes = [
  { value: "+91", label: "🇮🇳 +91", name: "India" },
  { value: "+93", label: "🇦🇫 +93", name: "Afghanistan" },
];

export default function BuySellForm({ product }) {
  const [open, setOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [user, setUser] = useState(null);
  const [buyer, setBuyer] = useState(null); 
  const [buySell, setBuySell] = useState("buy");
  const [productname, setProductname] = useState(product.name || "");
  const [message, setMessage] = useState("");
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [pincode, setPincode] = useState("");
  const [companyName, setCompanyName] = useState("");

 const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);


const [quantity, setQuantity] = useState("");
const [unit, setUnit] = useState("");
const [orderValue, setOrderValue] = useState("");
const [currency, setCurrency] = useState("INR");


  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setShowForm(false); // Hide form and show product details when closing
    setOpen(false); // Close the modal completely
  };
  const handleContinue = () => setShowForm(true); // Show the form when Continue is clicked
  const handlePrevious = () => setShowForm(false); // Show product details when Previous is clicked

  useEffect(() => {
    // Get user data from localStorage and set it to state
    const storedUser = JSON.parse(localStorage.getItem("user")); 
    const storedBuyer = localStorage.getItem("buyer"); 
    setUser(storedUser);
    setBuyer(storedBuyer);
  }, []);

  if (!product) return null; // No product, don't render anything

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
      setError("");
  
      try {
        const fullMobileNumber = `${countryCode.value}${mobileNumber.replace(/\s/g, "")}`;
        const apiUrl = buySell === "buy" ? "/api/auth/sendotpbuyer" : "/api/auth/sendotp";
        const requestBody = {
        fullname,
        email,
        mobileNumber: fullMobileNumber,
        countryCode: countryCode.value,
        productname, // Added product name
        };
        
        if (buySell === "sell") {
          requestBody.companyName = companyName;
          requestBody.pincode = pincode;
          requestBody.productname = productname;
          requestBody.fullname = fullname;
          requestBody.email = email;
          requestBody.mobileNumber = fullMobileNumber;
        }
  
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        const data = await res.json();
        if (res.ok) {
          setMessage(data.message);
          setOtpSent(true);
        } else {
          setError(data.error || "Unexpected error occurred.");
        }
      } catch (err) {
        setError("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };
  
    const handleOtpVerify = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMessage("");
      setError("");
    
      try {
        const fullMobileNumber = `${countryCode.value}${mobileNumber.replace(/\s/g, "")}`;
        const apiUrl = buySell === "buy"
          ? "/api/auth/verifyotpbuyer"
          : "/api/auth/verifyotp";
    
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mobileNumber: fullMobileNumber, otp }),
        });
    
        const data = await res.json();
        if (res.ok) {
          localStorage.setItem("buyer", fullMobileNumber);
          setBuyer(fullMobileNumber);
          setMessage("OTP verified successfully!");
    
          if (buySell === "sell") {
            dispatch(setUser({ user: data.user, token: data.token }));
            router.push("/userdashboard");
            toast.success("Seller verified");
          } else {
            toast.success("Buyer verified");
          }
    
          setOpen(false); // ✅ Corrected
        } else {
          setError(data.error || "Invalid OTP. Please try again.");
        }
      } catch (err) {
        setError("Invalid OTP or something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    

    const handlebuyerform = async (e) => {
      e.preventDefault();
      try {
        const buyerData = {
          productname,
          quantity,
          unit,
          orderValue,
          currency,
          buyer: buyer, // phone from localStorage
          requirementFrequency: "one-time", // or "recurring"
          sellerId: product?.userId, // ✅ dynamically passed seller Id
          productId: product?._id,     // ✅ dynamically passed
        };
    
        const res = await fetch("/api/purchaserequest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(buyerData),
        });
    
        const data = await res.json();
        if (res.ok) {
          toast.success("Request submitted successfully!");
          setOpen(false);
        } else {
          toast.error(data.error || "Submission failed.");
        }
      } catch (error) {
        toast.error("Something went wrong.");
        console.error(error);
      }
    };
    

    
  return (
    <div>
    <button
      onClick={handleOpen}
      className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition w-full mt-3"
    >
      Purchase {product?.name ? `(${product.name})` : ""}
    </button>

    {open && (
      <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-[90%] max-w-lg relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>

          <h2 className="text-2xl font-bold mb-4 text-center">
            You Are Purchasing
          </h2>

          {/* Verification UI for not logged-in or verified users */}
          {!user && !buyer && (
            <div className="mb-6">
              {message && <p className="text-green-600">{message}</p>}
              {error && <p className="text-red-600">{error}</p>}

              {otpSent ? (
                <form onSubmit={handleOtpVerify}>
                  <input
                    type="number"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={4}
                    className="form-control mb-3"
                    placeholder="Enter OTP"
                  />
                  <button
                    type="submit"
                    className="btn btn-success w-full"
                    disabled={loading}
                  >
                    {loading ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">I want to:</label>
                    <div>
                      <input
                        type="radio"
                        name="buy_sell"
                        value="buy"
                        checked={buySell === "buy"}
                        onChange={() => setBuySell("buy")}
                        className="me-2"
                      />{" "}
                      Buy
                      <input
                        type="radio"
                        name="buy_sell"
                        value="sell"
                        checked={buySell === "sell"}
                        onChange={() => setBuySell("sell")}
                        className="ms-3 me-2"
                      />{" "}
                      Sell
                    </div>
                  </div>

                  <input
                    type="text"
                    value={productname}
                    onChange={(e) => setProductname(e.target.value)}
                    required
                    className="form-control mb-2"
                    placeholder="Product Name"
                  />

                  <div className="mb-2 d-flex">
                    <Select
                      options={countryCodes}
                      value={countryCode}
                      onChange={setCountryCode}
                      className="me-2"
                    />
                    <input
                      type="number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                      maxLength={10}
                      className="form-control"
                      placeholder="Mobile Number"
                    />
                  </div>

                  {buySell === "sell" && (
                    <>
                      <input
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        required
                        className="form-control mb-2"
                        placeholder="Full Name"
                      />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="form-control mb-2"
                        placeholder="Email"
                      />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        className="form-control mb-2"
                        placeholder="Company Name"
                      />
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        required
                        className="form-control mb-2"
                        placeholder="Pincode"
                      />
                    </>
                  )}

                  <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              )}
            </div>
          )}

   {/* Product Details for logged-in users or verified buyers */}
{(user || buyer) && !showForm && (
  <>
    <div className="flex items-center gap-4 bg-gray-100 p-4 rounded mb-4">
      {/* Example product image and info */}
      <Image
         src={product?.images?.[0]?.url || "/placeholder.png"}
         alt={product.name}
        width={80}
        height={80}
        className="rounded"
      />
      <div>
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-700">{product.description}</p>
      </div>
    </div>

    <button
      onClick={handleContinue}
      className="btn btn-primary w-full"
    >
      Continue
    </button>
  </>
)}

{/* Buyer form after clicking "Continue" */}
{(user || buyer) && showForm && (
  <form onSubmit={handlebuyerform}>
    <input
      type="text"
      value={productname}
      onChange={(e) => setProductname(e.target.value)}
      className="form-control mb-2"
      placeholder="Product Name"
      required
    />

    <div className="mb-2 flex gap-2">
      <input
        type="text"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="form-control"
        placeholder="Quantity"
        required
      />
      <input
        type="text"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
        className="form-control"
        placeholder="Unit (e.g., kg, tons)"
        required
      />
    </div>

    <input
      type="text"
      value={orderValue}
      onChange={(e) => setOrderValue(e.target.value)}
      className="form-control mb-2"
      placeholder="Order Value"
      required
    />

    <select
      value={currency}
      onChange={(e) => setCurrency(e.target.value)}
      className="form-control mb-2"
    >
      <option value="INR">INR</option>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
    </select>

    <div className="flex justify-between gap-2">
      <button
        type="button"
        onClick={handlePrevious}
        className="btn btn-secondary w-full"
      >
        Previous
      </button>
      <button
        type="submit"
        className="btn btn-success w-full"
      >
        Submit Request
      </button>
    </div>
  </form>
)}

        </div>
      </div>
    )}
  </div>
  );
}
