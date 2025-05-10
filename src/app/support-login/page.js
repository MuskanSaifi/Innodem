"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SupportPersonLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const loadingToast = toast.loading("Logging in...");

    try {
      const res = await fetch("/api/adminprofile/supportmembers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.dismiss(loadingToast);
        toast.error(data.error || "Login failed");
        return;
      }

      toast.success("Login successful!");
      toast.dismiss(loadingToast);
      setTimeout(() => {
        router.push("/support-dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      toast.dismiss(loadingToast);
      toast.error("Something went wrong");
    }
  };

  
  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-3 text-center">Support Person Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Login
        </button>
      </form>
    </div>
  );
}
