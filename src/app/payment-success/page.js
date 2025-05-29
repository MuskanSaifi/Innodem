import { Suspense } from "react";
import PaymentSuccess from "./Paymentsuccess";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccess />
    </Suspense>
  );
}
