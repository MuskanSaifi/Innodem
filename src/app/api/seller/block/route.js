import { NextResponse } from "next/server";
import BlockedUser from "@/models/BlockedUser";
import User from "@/models/User";
import { requireSignIn } from "@/middlewares/requireSignIn";
import connectdb from "@/lib/dbConnect";

export async function POST(req) {
  await connectdb();

  try {
    const authUser = await requireSignIn(req);
    if (!authUser || !authUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sellerId } = await req.json();

    // Check seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // Check if already blocked
    const alreadyBlocked = await BlockedUser.findOne({ blockedBy: authUser.id, sellerId });
    if (alreadyBlocked) {
      return NextResponse.json({ message: "Seller already blocked" }, { status: 200 });
    }

    // Create block record
    const block = await BlockedUser.create({
      blockedBy: authUser.id,
      sellerId,
    });

    return NextResponse.json({
      success: true,
      message: "Seller has been blocked. You will not see their products anymore.",
      block,
    });
  } catch (err) {
    console.error("Block API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}



export async function GET(req) {
  await connectdb();

  try {
    // ✅ Fetch all blocked sellers with both details
    const blockedSellers = await BlockedUser.find({})
      .populate("blockedBy", "fullname email mobileNumber companyName")
      .populate("sellerId", "fullname email mobileNumber companyName")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: blockedSellers.length,
      blockedSellers,
    });
  } catch (err) {
    console.error("Get Blocked Users API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}