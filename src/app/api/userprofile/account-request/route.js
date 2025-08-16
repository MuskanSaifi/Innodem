import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

export async function PATCH(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the authorization header and check for a token
    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader) {
      return NextResponse.json({ success: false, message: "No token provided" }, { status: 401 });
    }

    // Extract the token and verify it
    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get the request body
    const { requestType } = await req.json();

    // Validate the request type
    if (!["deactivate", "delete"].includes(requestType)) {
      return NextResponse.json({ message: "Invalid request type" }, { status: 400 });
    }

    // Find and update the user document using the decoded user ID from the token
    const updatedUser = await User.findByIdAndUpdate(
      decoded.id, // Corrected from 'user._id' to 'decoded.id'
      { accountRequest: requestType },
      { new: true }
    );

    // Check if the user was found and updated
    if (!updatedUser) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Return a success response
    return NextResponse.json({ message: "Request submitted", user: updatedUser });
  } catch (err) {
    // Handle specific JWT errors or other general errors
    if (err instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }
    console.error("Error in account request PATCH handler:", err);
    return NextResponse.json({ message: "Internal Server Error", error: err.message }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}
