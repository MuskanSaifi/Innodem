"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PaymentSuccess() {
  const router = useRouter();
  const [message, setMessage] = useState("Processing payment...");

  useEffect(() => {
    if (!router.isReady) return;

    const { txnid, status, amount, udf1, productinfo } = router.query;

    if (!txnid || !status) {
      setMessage("Invalid payment data");
      return;
    }

    // Call backend API to update payment info
    async function updatePayment() {
      const res = await fetch("/api/payment/success", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          txnid,
          status,
          amount,
          udf1,
          productinfo,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("Payment processed successfully!");
      } else {
        setMessage("Payment update failed: " + data.message);
      }
    }

    updatePayment();
  }, [router.isReady, router.query]);

  return (
    <div>
      <h1>Payment Status</h1>
      <p>{message}</p>
    </div>
  );
}
