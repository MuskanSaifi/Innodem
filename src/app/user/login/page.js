"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [showOtpField, setShowOtpField] = useState(false);

    const router = useRouter()

    // Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobileNumber }),
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
            const res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobileNumber, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("Login successful!");
                localStorage.setItem("token", data.token); // Store token
                localStorage.setItem("user", JSON.stringify(data.user)); // Store user
                router.push("/userdashboard"); // ✅ Navigate instead of reloading


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
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Login with OTP</h2>

                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}

                {!showOtpField ? (
                    // Send OTP Form
                    <form onSubmit={handleSendOtp}>
                        <div className="mb-4">
                            <label className="block font-semibold mb-1">Mobile Number:</label>
                            <input
                                type="tel"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                                placeholder="Enter your mobile number"
                            />
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
                    // OTP Verification Form
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
                            <Link href="/user/register">Don't Have account Register first</Link>
                </div>
            </div>
        </div>
        
    );
}
