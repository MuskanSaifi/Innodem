import connectdb from "@/lib/dbConnect";
import Buyer from "@/models/Buyer";
import User from "@/models/User";
import Product from "@/models/Product";
import purchaseRequestSchema from "@/models/purchaseRequestSchema";

export async function GET(request, { params }) {
  try {
    await connectdb();

    const { userId } = await params;

    if (!userId) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const requests = await purchaseRequestSchema
      .find({ seller: userId })
      .populate("buyer")
      .populate("product");

    return Response.json({ success: true, data: requests });
  } catch (error) {
    console.error("Error fetching purchase requests:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
