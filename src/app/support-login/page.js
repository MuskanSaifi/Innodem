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

const supportPerson = {
  name: data.supportPerson.name,
  email: data.supportPerson.email,
};

localStorage.setItem("support_person", JSON.stringify(supportPerson));


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
<div className="container mx-auto flex justify-center items-center mt-5 mb-5 min-h-[500px]">
  <div className="shadow p-4 w-full max-w-md rounded-xl">
    <h3 className="text-center mb-4">Support Person Login</h3>
    <form onSubmit={handleLogin}>
      <div className="mb-3">
        <label className="form-label">Email address</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter your email"
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Enter your password"
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Login
      </button>
    </form>
  </div>
</div>

  );
}
