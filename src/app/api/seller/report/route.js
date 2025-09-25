// app/api/seller/report/route.js
import { NextResponse } from "next/server";
import Report from "@/models/Report";
import User from "@/models/User";
import connectdb from "@/lib/dbConnect";
import { requireSignIn } from "@/middlewares/requireSignIn";

export async function POST(req) {
  await connectdb();

  try {
    const authUser = await requireSignIn(req);
    if (!authUser || !authUser.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sellerId, reason } = await req.json();

    // Check seller exists
    const seller = await User.findById(sellerId);
    if (!seller) {
      return NextResponse.json({ error: "Seller not found" }, { status: 404 });
    }

    // Create a new report
    const report = await Report.create({
      reportedBy: authUser.id,
      sellerId,
      reason,
    });

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully. Admin will review within 24 hours.",
      report,
    });
  } catch (err) {
    console.error("Report API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}


export async function GET(req) {
  await connectdb();

  try {
    // ✅ Fetch all reports with reporter & seller details
    const reports = await Report.find({})
      .populate("reportedBy", "fullname email")
      .populate("sellerId", "fullname email companyName")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (err) {
    console.error("Get Reports API error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}