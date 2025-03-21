"use client";
import React from "react";
import { Button } from "react-bootstrap";

const handlePayment = async (amount) => {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: "67d1663a97fed582368e77a4", // Replace with actual user ID
      amount: amount,
      email: "user@example.com",
      mobile: "9876543210",
      productInfo: "Handmade Shoes",
    }),
  });

  const { url, data } = await response.json();
  // Create a form and submit to PayU
  const form = document.createElement("form");
  form.method = "POST";
  form.action = url;

  Object.keys(data).forEach((key) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = data[key];
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

const Page = () => {
  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        {[1, 2, 3, 4].map((item, index) => (
          <div key={index} className="col-md-3 text-center">
            <h1>₹2</h1>
            <Button className="mt-3" onClick={() => handlePayment(2)}>
              Buy Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
