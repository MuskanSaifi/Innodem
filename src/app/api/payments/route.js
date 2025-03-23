import { NextResponse } from "next/server";
import crypto from "crypto";
import UserPayment from "@/models/UserPayment";
import connectdb from "@/lib/dbConnect";

export async function POST(req) {
  try {
    await connectdb();

    const { userId, amount, email, mobile, productInfo } = await req.json();

    if (!userId || !amount || !email || !mobile || !productInfo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }


    const merchantKey = process.env.NEXT_PUBLIC_PAYU_MERCHANT_KEY;
    const salt = process.env.NEXT_PUBLIC_PAYU_SALT;
    const mode =
      process.env.NEXT_PUBLIC_PAYU_MODE === "test"
        ? "https://test.payu.in/_payment"
        : "https://secure.payu.in/_payment";

    if (!merchantKey || !salt) {
      return NextResponse.json({ error: "PayU credentials missing" }, { status: 500 });
    }

    const orderId = `ORDER${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const transactionId = `TXN${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // ✅ **Check if User Already Has an Active Package**
    const existingPayment = await UserPayment.findOne({
      userId,
      paymentStatus: "Success",
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "User already has an active package." },
        { status: 400 }
      );
    }

    // ✅ **Generate Hash**
const hashString = `${merchantKey}|${orderId}|${amount}|${productInfo}|${email.split("@")[0]}|${email}|||||||||||${salt}`;
const hash = crypto.createHash("sha512").update(hashString).digest("hex");


    const payuData = {
      key: merchantKey,
      txnid: orderId,
      amount,
      productinfo: productInfo,
      firstname: email.split("@")[0],
      email,
      phone: mobile,
      surl: process.env.NEXT_PUBLIC_PAYU_SUCCESS_URL,
      furl: process.env.NEXT_PUBLIC_PAYU_FAILURE_URL,
      hash,
    };

    // ✅ **Set Expiry Date (1 Year from Now)**
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    // ✅ **Save payment to DB with expiration date**
    await UserPayment.create({
      userId,
      orderId,
      transactionId,
      amount,
      currency: "INR",
      paymentStatus: "Pending",
      payerEmail: email,
      payerMobile: mobile,
      packageExpiry: expiryDate, // Save expiry date
    });

    return NextResponse.json({ url: mode, data: payuData }, { status: 200 });
  } catch (error) {
    console.error("❌ Payment Error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
