import { NextResponse } from "next/server";
import UserPayment from "@/models/UserPayment";
import connectdb from "@/lib/dbConnect";

export async function POST(req) {
  try {
    await connectdb();
    const { txnid, status } = await req.json();

    const paymentStatus = status === "success" ? "Success" : "Failed";
    
    await UserPayment.findOneAndUpdate({ orderId: txnid }, { paymentStatus });

    return NextResponse.json({ message: "Payment updated" }, { status: 200 });

  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}
