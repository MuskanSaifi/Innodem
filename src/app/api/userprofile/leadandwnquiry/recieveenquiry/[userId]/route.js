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


// PATCH function to update the status of a purchase request
export async function PATCH(request, { params }) {
  try {
    await connectdb();

    // FIX: Await params before destructuring userId
    const { userId } = await params; // <--- CHANGE IS HERE

    const body = await request.json();
    const { requestId, status } = body; // Expecting requestId and new status in the request body

    if (!userId) {
      return Response.json(
        { success: false, message: "Seller User ID is required in URL" },
        { status: 400 }
      );
    }

    if (!requestId || !status) {
      return Response.json(
        { success: false, message: "Request ID and status are required in body" },
        { status: 400 }
      );
    }

    const allowedStatuses = ['Pending', 'Completed', 'Cancelled', 'Responded'];
    if (!allowedStatuses.includes(status)) {
      return Response.json(
        { success: false, message: `Invalid status provided. Allowed: ${allowedStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    const updatedRequest = await purchaseRequestSchema.findOneAndUpdate(
      { _id: requestId, seller: userId },
      { status: status },
      { new: true }
    ).populate("buyer")
     .populate("product");

    if (!updatedRequest) {
      return Response.json(
        { success: false, message: "Purchase request not found or not associated with this seller." },
        { status: 404 }
      );
    }

    return Response.json({ success: true, message: "Status updated successfully", data: updatedRequest });
  } catch (error) {
    console.error("Error updating purchase request status:", error);
    return Response.json(
      { success: false, message: "Server error during status update" },
      { status: 500 }
    );
  }
}