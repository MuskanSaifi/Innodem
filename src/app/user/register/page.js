"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [pincode, setPincode] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // OTP Verification
    const [otp, setOtp] = useState("");
    const [loginnumber, setLoginnumber] = useState("");
    const [signup, setSignup] = useState(false);


    const router = useRouter()
    // Handle Registration Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("http://localhost:3000/api/auth/sendotp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname, email, mobileNumber, pincode, companyName }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setLoginnumber(data.mobileNumber);
                setSignup(true);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // Handle OTP Verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch("http://localhost:3000/api/auth/verifyotp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mobileNumber: loginnumber, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage("OTP verified successfully!");
                localStorage.setItem("token", data.token); // Store token
                localStorage.setItem("user", JSON.stringify(data.user)); // Store user
                router.push('/userdashboard')
                setSignup(false); // Redirect or handle success scenario
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
                <h2 className="text-2xl font-bold mb-4">{signup ? "Verify OTP" : "Register"}</h2>

                {message && <p className="text-green-600">{message}</p>}
                {error && <p className="text-red-600">{error}</p>}

                {signup ? (
                    // OTP Verification Form
                    <form onSubmit={handleVerifyOtp}>
                        <div className="mb-4">
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
                ) : (
                    // Registration Form
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                value={fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="tel"
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                                placeholder="Enter your mobile number"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                                placeholder="Enter your pincode"
                            />
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                                placeholder="Enter your company name"
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
                )}
                  <div className="mt-4">
                            <Link href="/user/login">Already have account Login</Link>
                </div>
            </div>
        </div>
    );
}
