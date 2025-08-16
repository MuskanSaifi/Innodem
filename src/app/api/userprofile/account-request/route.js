// app/api/userprofile/account-request/route.js
import { NextResponse } from "next/server";
import { requireSignIn } from "@/middlewares/requireSignIn";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(req) {
  try {
    await dbConnect();


    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader) {
      return new Response(JSON.stringify({ success: false, message: "No token provided" }), { status: 401 });
    }

    const token = authorizationHeader.split(" ")[1];
    // Verify JWT token with the secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    const { requestType } = await req.json();
    if (!["deactivate", "delete"].includes(requestType)) {
      return NextResponse.json({ message: "Invalid request type" }, { status: 400 });
    }

const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { accountRequest: requestType },
    { new: true }
);

    return NextResponse.json({ message: "Request submitted", user: updatedUser });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
