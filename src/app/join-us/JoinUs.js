"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Select from "react-select";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/userSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const images = [
  "/assets/joinus-0.jpeg",
  // "/assets/join-2.png",
  // "/assets/join-3.png",
  "/assets/join-us.png",
];

const countryCodes = [
  { value: "+91", label: "🇮🇳 +91", name: "India" },
  { value: "+93", label: "🇦🇫 +93", name: "Afghanistan" },
];

const JoinUs = () => {
  const [productname, setProductname] = useState("");
  const [buySell, setBuySell] = useState("sell");
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

    const fullMobileNumber = `${countryCode.value}${mobileNumber.replace(/\s/g, "")}`;
    const requestBody = {
      fullname,
      email,
      mobileNumber: fullMobileNumber,
      countryCode: countryCode.value,
      productname: Array.isArray(productname) ? productname[0] : productname, // ✅ Ensure string
    };

    try {
      if (buySell === "sell") {
        requestBody.companyName = companyName;
        requestBody.pincode = pincode;
        const res = await fetch("/api/auth/sendotp", {
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
      } else {
        // BUYER - directly register without OTP
        const res = await fetch("/api/auth/buyerregister", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await res.json();
        if (res.ok) {
          toast.success(data.message || "Registration successful!");
          router.push("/thankyou");
        } else {
          setError(data.error || "Unexpected error occurred.");
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
        router.push("/thankyou");
      } else {
        setError(data.error || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("Invalid OTP or something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937",
      color: "#fff",
      borderColor: "#374151",
      minHeight: "48px",
      width: "100%",
      borderRadius: "0.375rem",
      boxShadow: "none",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "#fff",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#1f2937",
      color: "#fff",
    }),
  };

  return (
    <div className="py-5 flex items-center justify-center bg-gray-900 text-white px-1">
      <div className="flex flex-col md:flex-row max-w-5xl w-full bg-gray-800 rounded-2xl overflow-hidden shadow-lg">
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6">
          <h2 className="text-3xl font-bold mb-4">Join us today 👋</h2>
          <p className="text-sm text-gray-300 mb-6">
            Buy or sell with ease — join our platform and grow your business smarter and faster. Register now!
          </p>

          {message && <p className="text-green-500">{message}</p>}
          {error && <p className="text-red-500">{error}</p>}

          {otpSent ? (
            <form onSubmit={handleOtpVerify}>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full p-3 mb-4 rounded bg-gray-700 text-white"
                placeholder="Enter OTP"
              />
              <button type="submit" className="w-full bg-green-600 hover:bg-green-700 p-3 rounded font-medium" disabled={loading}>
                {loading ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm mb-1">I want to:</label>
                <div className="flex items-center gap-4">
                  <label>
                    <input type="radio" name="buy_sell" value="buy" className="mr-2" checked={buySell === "buy"} onChange={() => setBuySell("buy")} />
                    Buy
                  </label>
                  <label>
                    <input type="radio" name="buy_sell" value="sell" className="mr-2" checked={buySell === "sell"} onChange={() => setBuySell("sell")} />
                    Sell
                  </label>
                </div>
              </div>

              <input type="text" value={productname} onChange={(e) => setProductname(e.target.value)} required className="w-full p-3 mb-3 rounded bg-gray-700 text-white" placeholder="Product Name" />

              <div className="flex gap-3 mb-3">
                <div className="w-1/3">
                  <Select styles={customStyles} options={countryCodes} value={countryCode} onChange={setCountryCode} />
                </div>
                <input
                  type="number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                  className="w-2/3 p-3 rounded bg-gray-700 text-white"
                  placeholder="Mobile Number"
                />
              </div>

              {buySell === "sell" && (
                <>
                  <input type="text" value={fullname} onChange={(e) => setFullname(e.target.value)} required className="w-full p-3 mb-3 rounded bg-gray-700 text-white" placeholder="Full Name" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 mb-3 rounded bg-gray-700 text-white" placeholder="Email" />
                </>
              )}

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-medium" disabled={loading}>
                {loading ? (buySell === "sell" ? "Sending OTP..." : "Registering...") : "Submit"}
              </button>
            </form>
          )}
        </div>

        {/* Image/Swiper Section */}
        <div className="w-full md:w-1/2 flex justify-center items-center overflow-hidden p-4">
          <div className="w-full">
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={1}
              spaceBetween={20}
              pagination={{ clickable: true }}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop={true}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index}>
                  <div className="flex justify-center items-center">
                    <Image src={src} alt={`Slide ${index}`} width={500} height={500} className="rounded-md" />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
