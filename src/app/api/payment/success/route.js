import { NextResponse } from "next/server";
import User from "@/models/User";
import connectdb from "@/lib/dbConnect";

export async function POST(req) {
  const body = await req.formData(); // PayU sends form-urlencoded
  const userId = body.get("udf1");
  const status = body.get("status"); // Check if the payment was successful
  const amount = parseFloat(body.get("amount"));
  const txnid = body.get("txnid");

  // Check if the payment was successful
  if (status !== "success") {
    return NextResponse.json({ success: false, message: "Payment failed" });
  }

  try {
    await connectdb();
    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    // Update user's package information after payment success
    await User.findByIdAndUpdate(userId, {
      userPackage: {
        packageName: body.get("productinfo"),
        totalAmount: amount,
        paidAmount: amount,
        remainingAmount: 0,
        packageStartDate: new Date(),
        packageExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      }
    });
    return NextResponse.json({ success: true, message: "Payment processed successfully" });
  } catch (error) {
    console.error("Error processing payment:", error);
    return NextResponse.json({ success: false, message: "Error processing payment" });
  }
}
