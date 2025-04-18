
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await connectdb();

    // Extract Authorization header
    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader) {
      return new Response(
        JSON.stringify({ success: false, message: "No token provided" }),
        { status: 401 }
      );
    }

    // Extract token from "Bearer <token>"
    const token = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.split(" ")[1]
      : authorizationHeader;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token format" }),
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("JWT verification failed:", error);
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { status: 401 }
      );
    }

    // Fetch user details from database (FIX: Use decoded.id instead of decoded.userId)
    const user = await User.findById(decoded.id, "fullname email mobileNumber companyName userPackage userPackageHistory isVerified");
// Count products created by the user
const productsLength = await Product.countDocuments({ userId: decoded.id });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, message: "User not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, user, productsLength }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching user", error: error.message }),
      { status: 500 }
    );
  }
}
