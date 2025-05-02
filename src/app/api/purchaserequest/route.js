import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import Buyer from "@/models/Buyer";
import purchaseRequestSchema from "@/models/purchaseRequestSchema";

export async function POST(request) {
  await connectdb();

  try {
    const body = await request.json();

    const {
      productname,
      quantity,
      unit,
      orderValue,
      currency,
      buyer: buyerMobileNumber,
      requirementFrequency,
      sellerId,
      productId,
    } = body;

    // 1. Find the buyer using mobile number
    const buyer = await Buyer.findOne({ mobileNumber: buyerMobileNumber });

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    // 2. Create PurchaseRequest
    const purchaseRequest = await purchaseRequestSchema.create({
      buyer: buyer._id,
      seller: sellerId,
      product: productId,
      quantity,
      unit,
      approxOrderValue: {
        amount: orderValue,
        currency,
      },
      requirementFrequency,
    });

    return NextResponse.json({ success: true, purchaseRequest }, { status: 200 });

  } catch (error) {
    console.error("Error creating purchase request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
