"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Select from "react-select";
import toast from "react-hot-toast";

const countryCodes = [
  { value: "+1", label: "\ud83c\uddfa\ud83c\uddf8 +1", name: "United States" },
  { value: "+91", label: "\ud83c\uddee\ud83c\uddf3 +91", name: "India" },
  { value: "+44", label: "\ud83c\uddec\ud83c\udde7 +44", name: "United Kingdom" },
  { value: "+971", label: "\ud83c\udde6\ud83c\uddea +971", name: "UAE" },
];

const BuySellForm = ({ productname: initialProductName }) => {
  const [productname, setProductname] = useState(initialProductName || "");
  const [showModal, setShowModal] = useState(false);
  const [buySell, setBuySell] = useState("buy");
  const [fullname, setFullname] = useState("");
  const [countryCode, setCountryCode] = useState(countryCodes[1]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 9000);
    return () => clearTimeout(timer);
  }, []);

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
        : `/api/auth/verifyotp`; // Seller API
  
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: fullMobileNumber, otp }),
      });
  
      const data = await res.json();
      if (res.ok) {
        setMessage("OTP verified successfully!");
  
        if (buySell === "sell") {
          // Store seller data in localStorage and redirect to user dashboard
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          router.push("/userdashboard");
        } else {
          toast.success("verified")
        }
        setShowModal(false);
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Invalid OTP or something went wrong!");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className={`modal fade ${showModal ? "show d-block" : ""}`} style={{ background: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Tell us what you need</h5>
            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
          </div>
          <div className="modal-body">
            {message && <p className="text-success">{message}</p>}
            {error && <p className="text-danger">{error}</p>}

            {otpSent ? (
              <form onSubmit={handleOtpVerify}>
                <div className="mb-3">
                  <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required className="form-control" placeholder="Enter OTP" />
                </div>
                <button type="submit" className="btn btn-success w-100" disabled={loading}>{loading ? "Verifying OTP..." : "Verify OTP"}</button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">I want to:</label>
                  <div>
                    <input type="radio" name="buy_sell" value="buy" className="form-check-input me-2" checked={buySell === "buy"} onChange={() => setBuySell("buy")} /> Buy
                    <input type="radio" name="buy_sell" value="sell" className="form-check-input ms-3 me-2" checked={buySell === "sell"} onChange={() => setBuySell("sell")} /> Sell
                  </div>
                </div>
                <div className="mb-3">
                  <input type="text" value={productname} onChange={(e) => setProductname(e.target.value)} required className="form-control" placeholder="Product Name" />
                </div>
                <div className="mb-3">
                  <Select options={countryCodes} value={countryCode} onChange={setCountryCode} className="mb-3" />
                  <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} required className="form-control" placeholder="Mobile Number" />
                </div>
               
                {buySell === "sell" && (
                  <>
                    <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required className="form-control mb-3" placeholder="Full Name" />
                    <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control mb-3" placeholder="Email" />
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="form-control mb-3" placeholder="Company Name" />
                    <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} required className="form-control mb-3" placeholder="Pincode" />
                  </>
                )}
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Sending OTP..." : "Send OTP"}</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySellForm;
