"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";

const countryCodes = [
  { value: "+1", label: "\ud83c\uddfa\ud83c\uddf8 +1", name: "United States" },
  { value: "+91", label: "\ud83c\uddee\ud83c\uddf3 +91", name: "India" },
  { value: "+44", label: "\ud83c\uddec\ud83c\udde7 +44", name: "United Kingdom" },
  { value: "+971", label: "\ud83c\udde6\ud83c\uddea +971", name: "UAE" },
];

const BuySellForm = () => {
  const [showModal, setShowModal] = useState(false);
  const [buySell, setBuySell] = useState("buy");
  const [productname, setProductname] = useState("");
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
    const timer = setTimeout(() => setShowModal(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
        const fullMobileNumber = `${countryCode.value}${mobileNumber.replace(/\s/g, "")}`; // Remove spaces

        const res = await fetch("http://localhost:3000/api/auth/sendotp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                productname, 
                fullname,
                email, 
                mobileNumber: fullMobileNumber, 
                pincode, 
                companyName
                          }),
        });

        const data = await res.json();
        console.log("📢 API Response:", data); // Log the API response for debugging

        if (res.ok) {
            setMessage(data.message);
            setOtpSent(true); // Show OTP input field
        } else {
            setError(data.error || "Unexpected error occurred.");
        }
    } catch (err) {
        console.error("❌ Error sending OTP:", err);
        setError("Something went wrong!");
    } finally {
        setLoading(false);
    }
};


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const fullMobileNumber = `${countryCode.value}${mobileNumber}`;
      const res = await fetch("http://localhost:3000/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: fullMobileNumber, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("OTP verified successfully!");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/userdashboard");
        setShowModal(false);
      } else {
        setError(data.error);
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
              <form onSubmit={handleVerifyOtp}>
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
                  <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required className="form-control" placeholder="Enter Your Name" />
                </div>
                <div className="mb-3 d-flex">
                  <Select options={countryCodes} value={countryCode} onChange={setCountryCode} className="me-2" />
                  <input
    type="tel"
    value={mobileNumber}
    onChange={(e) => setMobileNumber(e.target.value.replace(/\s/g, ""))} // Remove spaces dynamically
    required
    className="form-control"
    placeholder="Enter Mobile Number"
/>

                </div>
                {buySell === "sell" && (
                  <>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" placeholder="Enter Email" />
                    <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} required className="form-control" placeholder="Enter Pincode" />
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required className="form-control" placeholder="Enter Company Name" />
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