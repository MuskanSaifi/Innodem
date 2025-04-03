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




export async function DELETE(req) {
  try {
    await connectdb();
    const { searchParams } = new URL(req.url);
    const buyerId = searchParams.get("id"); // Get buyer ID from query params

    if (!buyerId) {
      return NextResponse.json({ success: false, message: "Buyer ID is required" }, { status: 400 });
    }

    const deletedBuyer = await Buyer.findByIdAndDelete(buyerId);
    if (!deletedBuyer) {
      return NextResponse.json({ success: false, message: "Buyer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Buyer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting buyer:", error);
    return NextResponse.json({ success: false, message: "Failed to delete buyer" }, { status: 500 });
  }
}
