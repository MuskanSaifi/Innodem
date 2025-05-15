"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Select from "react-select";
import toast from "react-hot-toast";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/userSlice";

const countryCodes = [
  { value: "+91", label: "🇮🇳 +91", name: "India" },
  { value: "+93", label: "🇦🇫 +93", name: "Afghanistan" },
];

const BuySell = ({ productname: initialProductName }) => {
  const [productname, setProductname] = useState(initialProductName || "");
  const [buySell, setBuySell] = useState("buy");
  const [fullname, setFullname] = useState("");
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [mobileNumber, setMobileNumber] = useState("");
  const [email, setEmail] = useState("");
  const [pincode, setPincode] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
console.log(productname, "TATT")
    const fullMobileNumber = `${countryCode.value}${mobileNumber.replace(/\s/g, "")}`;

    try {
      if (buySell === "buy") {
        const res = await fetch("/api/auth/buyerlead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname,
            email,
            mobileNumber: fullMobileNumber,
            countryCode: countryCode.value,
            productname,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success("Your request has been submitted!");
          setMessage(data.message);
        } else {
          setError(data.error || "Failed to submit your request.");
        }
      } else {
        const res = await fetch("/api/auth/sendotp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullname,
            email,
            mobileNumber: fullMobileNumber,
            countryCode: countryCode.value,
            productname,
            companyName,
            pincode,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setMessage(data.message);
          setOtpSent(true);
        } else {
          setError(data.error || "Failed to send OTP.");
        }
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

    const fullMobileNumber = `${countryCode.value}${mobileNumber.replace(/\s/g, "")}`;

    try {
      const res = await fetch("/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobileNumber: fullMobileNumber, otp }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("OTP verified successfully!");
        dispatch(setUser({ user: data.user, token: data.token }));
        router.push("/userdashboard");
      } else {
        setError(data.error || "Invalid OTP.");
      }
    } catch (err) {
      setError("Verification failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-4 p-3 border rounded">
      <h5 className="fw-bold mb-3">Tell us what you need</h5>
      <div className="row">
        <div className="col-12">
          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-danger">{error}</p>}

          {otpSent ? (
            <form onSubmit={handleOtpVerify}>
              <div className="mb-3">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="form-control"
                  placeholder="Enter OTP"
                />
              </div>
              <button type="submit" className="btn btn-success w-100" disabled={loading}>
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
                    className="form-check-input me-2"
                    checked={buySell === "buy"}
                    onChange={() => setBuySell("buy")}
                  />{" "}
                  Buy
                  <input
                    type="radio"
                    name="buy_sell"
                    value="sell"
                    className="form-check-input ms-3 me-2"
                    checked={buySell === "sell"}
                    onChange={() => setBuySell("sell")}
                  />{" "}
                  Sell
                </div>
              </div>

              <div className="mb-2">
                <input
                  type="text"
                  value={productname}
                  onChange={(e) => setProductname(e.target.value)}
                  required
                  className="form-control"
                  placeholder="Product Name"
                />
              </div>

              <div className="mb-2 d-flex">
                <Select options={countryCodes} value={countryCode} onChange={setCountryCode} className="me-2" />
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className="form-control"
                  placeholder="Mobile Number"
                />
              </div>

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

              {buySell === "sell" && (
                <>
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

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? (buySell === "sell" ? "Sending OTP..." : "Submitting...") : (buySell === "sell" ? "Send OTP" : "Submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuySell;
