import connectdb from "@/lib/dbConnect";
import Buyer from "@/models/Buyer";
import User from "@/models/User";
import Product from "@/models/Product";
import purchaseRequestSchema from "@/models/purchaseRequestSchema";

export async function GET(request, context) {
  try {
    await connectdb();

    // 1. Await context params
    const { params } = context;  // Safely access params

    // 2. Get userId from params
    const userId = params?.userId; // Access userId

    // 3. Check if userId is available
    if (!userId) {
      return Response.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch purchase requests from the database
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
