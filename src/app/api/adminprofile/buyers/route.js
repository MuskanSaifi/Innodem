import connectdb from "@/lib/dbConnect";
import Buyer from "@/models/Buyer";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectdb();
    
    // Fetch all buyers
    const buyers = await Buyer.find().lean();

    return NextResponse.json(
      {
        success: true,
        message: "Buyers retrieved successfully",
        totalBuyers: buyers.length, // ✅ Include total count of buyers
        buyers, // ✅ Send all buyer details
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ Error fetching buyers:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch buyers",
        totalBuyers: 0, // ✅ Return 0 in case of error
      },
      { status: 500 }
    );
  }
}
