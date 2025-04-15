"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

const InitiatePayment = () => {
  const searchParams = useSearchParams();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const initiatePayment = async () => {
      const amount = searchParams.get('amount');  // Extract dynamic amount from URL query parameters
      const packageName = searchParams.get('packageName'); // Extract package name

      console.log("User Data:", user);  // Log the user data to verify it
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount,  // Use dynamic amount
          email: user.email,
          name: user.fullname,  // Use fullname here
          userId: user._id,
          packageName: packageName,  // Use dynamic package name
          productInfo: `${packageName} for year 2025` // Dynamically set product info
        })
      });
      
      const data = await response.json();
      console.log("Payment Initiate Response:", data);  // Log the full response from the server

      if (data?.action) {
        // Submit a form to PayU with the returned params
        const form = document.createElement("form");
        form.method = "POST";
        form.action = data.action;

        for (const key in data.params) {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = data.params[key];
          form.appendChild(input);
        }
        
        console.log("Form Data Sent to PayU:", data.params);  // Log the form data before submitting
        document.body.appendChild(form);
        form.submit();
      }
    };

    if (user) initiatePayment();
  }, [user, searchParams]);

  return <div>Redirecting to payment...</div>;
};

export default InitiatePayment;
