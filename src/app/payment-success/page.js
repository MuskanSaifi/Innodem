"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState("Processing payment...");

  useEffect(() => {
    const txnid = searchParams.get("txnid");
    const status = searchParams.get("status");
    const amount = searchParams.get("amount");
    const udf1 = searchParams.get("udf1");
    const productinfo = searchParams.get("productinfo");

    if (!txnid || !status) {
      setMessage("Invalid payment data");
      return;
    }

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
  }, [searchParams]);

  return (
    <div>
      <h1>Payment Status</h1>
      <p>{message}</p>
    </div>
  );
}
