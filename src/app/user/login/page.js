"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Select from "react-select";
import Image from "next/image";

import { useDispatch } from "react-redux";
import { setUser } from "@/app/store/userSlice";



// Country Code List
const countryCodes = [
    { value: "+91", label: "🇮🇳 +91", name: "India" },
    { value: "+1", label: "🇺🇸 +1", name: "United States" },
    { value: "+44", label: "🇬🇧 +44", name: "United Kingdom" },
    { value: "+33", label: "🇫🇷 +33", name: "France" },
    { value: "+49", label: "🇩🇪 +49", name: "Germany" },
    { value: "+81", label: "🇯🇵 +81", name: "Japan" },
    { value: "+61", label: "🇦🇺 +61", name: "Australia" },
    { value: "+7", label: "🇷🇺 +7", name: "Russia" },
    { value: "+86", label: "🇨🇳 +86", name: "China" },
    { value: "+971", label: "🇦🇪 +971", name: "United Arab Emirates" },
    { value: "+92", label: "🇵🇰 +92", name: "Pakistan" },
    { value: "+880", label: "🇧🇩 +880", name: "Bangladesh" },
    { value: "+39", label: "🇮🇹 +39", name: "Italy" },
    { value: "+34", label: "🇪🇸 +34", name: "Spain" },
    { value: "+55", label: "🇧🇷 +55", name: "Brazil" },
    { value: "+27", label: "🇿🇦 +27", name: "South Africa" },
    { value: "+82", label: "🇰🇷 +82", name: "South Korea" },
    { value: "+60", label: "🇲🇾 +60", name: "Malaysia" },
    { value: "+63", label: "🇵🇭 +63", name: "Philippines" },
    { value: "+31", label: "🇳🇱 +31", name: "Netherlands" },
    { value: "+46", label: "🇸🇪 +46", name: "Sweden" },
    { value: "+20", label: "🇪🇬 +20", name: "Egypt" },
    { value: "+62", label: "🇮🇩 +62", name: "Indonesia" },
    { value: "+98", label: "🇮🇷 +98", name: "Iran" },
    { value: "+966", label: "🇸🇦 +966", name: "Saudi Arabia" },
    { value: "+90", label: "🇹🇷 +90", name: "Turkey" },
    { value: "+64", label: "🇳🇿 +64", name: "New Zealand" },
    { value: "+32", label: "🇧🇪 +32", name: "Belgium" },
    { value: "+65", label: "🇸🇬 +65", name: "Singapore" },
    { value: "+351", label: "🇵🇹 +351", name: "Portugal" },
    { value: "+54", label: "🇦🇷 +54", name: "Argentina" },
    { value: "+972", label: "🇮🇱 +972", name: "Israel" },
    { value: "+233", label: "🇬🇭 +233", name: "Ghana" },
    { value: "+254", label: "🇰🇪 +254", name: "Kenya" },
    { value: "+234", label: "🇳🇬 +234", name: "Nigeria" },
    { value: "+94", label: "🇱🇰 +94", name: "Sri Lanka" },
    { value: "+84", label: "🇻🇳 +84", name: "Vietnam" },
    { value: "+213", label: "🇩🇿 +213", name: "Algeria" },
    { value: "+505", label: "🇳🇮 +505", name: "Nicaragua" },
    { value: "+351", label: "🇵🇹 +351", name: "Portugal" },
    { value: "+977", label: "🇳🇵 +977", name: "Nepal" },
    { value: "+250", label: "🇷🇼 +250", name: "Rwanda" },
    { value: "+998", label: "🇺🇿 +998", name: "Uzbekistan" },
    { value: "+356", label: "🇲🇹 +356", name: "Malta" },
    { value: "+370", label: "🇱🇹 +370", name: "Lithuania" },
    { value: "+373", label: "🇲🇩 +373", name: "Moldova" },
  ];
  
export default function Login() {
    const [countryCode, setCountryCode] = useState(countryCodes[0]); // Default to India
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showOtpField, setShowOtpField] = useState(false);

    const dispatch = useDispatch();
    const router = useRouter();

    // Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const fullMobileNumber = `${countryCode.value}${mobileNumber}`; // Combine country code and mobile number

            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobileNumber: fullMobileNumber }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setShowOtpField(true);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");
        try {
            const fullMobileNumber = `${countryCode.value}${mobileNumber}`;

            const res = await fetch(`/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobileNumber: fullMobileNumber, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Login successful!");
              // Redux store update karen
                dispatch(setUser({ user: data.user, token: data.token }));
                router.push("/userdashboard"); 
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
        <div className="flex justify-center items-center m-5">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4 text-center">Login with Mobile </h2>

                <Image
                src={"/assets/2-copy-0.png"  || "/placeholder.png"}
                alt="login user"
                width={180}
                height={180}
                className="rounded img-fluid m-auto"
                style={{ objectFit: "cover" }}
                priority={false}
              />

                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!showOtpField ? (
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Mobile Number:</label>
                            <div className="flex items-center">
                                <div className="w-48 h-full">
                                    <Select
                                        options={countryCodes}
                                        value={countryCode}
                                        onChange={setCountryCode}
                                        className="w-full"
                                        getOptionLabel={(e) => `${e.label}`} // Show only Flag + Code
                                        filterOption={(option, input) =>
                                            option.data.name.toLowerCase().includes(input.toLowerCase()) ||
                                            option.data.value.includes(input)
                                        }
                                        styles={{
                                            control: (base) => ({
                                                ...base,
                                                minHeight: "42px",
                                                minWidth: "100px",
                                                whiteSpace: "nowrap",
                                                borderRadius: "6px 0 0 6px",
                                            }),
                                            singleValue: (base) => ({
                                                ...base,
                                                whiteSpace: "nowrap",
                                            }),
                                            menu: (base) => ({
                                                ...base,
                                                zIndex: 9999,
                                            }),
                                        }}
                                    />
                                </div>
                                <input
                                    type="tel"
                                    value={mobileNumber}
                                    onChange={(e) => setMobileNumber(e.target.value)}
                                    required
                                    className="w-full p-2 border rounded-r h-[42px]"
                                    placeholder="Enter your mobile number"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            disabled={loading}
                        >
                            {loading ? "Sending OTP..." : "Send OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Enter OTP:</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                                placeholder="Enter OTP"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                            disabled={loading}
                        >
                            {loading ? "Verifying OTP..." : "Verify OTP"}
                        </button>                        
                    </form>
                )}
                <div className="mt-4">
                    <Link href="/user/register">Don't have an account? Register here</Link>
                </div>
            </div>
        </div>
    );
}
