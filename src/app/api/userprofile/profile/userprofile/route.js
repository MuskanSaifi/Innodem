
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import slugify from "slugify"; // Make sure this is installed via npm


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
    const user = await User.findById(decoded.id, "userProfileSlug fullname email mobileNumber alternateMobileNumber alternateEmail whatsappNumber designation  companyName  userPackage userPackageHistory isVerified");
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


export async function PATCH(req) {
  try {
    await connectdb();

    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader) {
      return new Response(JSON.stringify({ success: false, message: "No token provided" }), { status: 401 });
    }

    const token = authorizationHeader.startsWith("Bearer ") ? authorizationHeader.split(" ")[1] : authorizationHeader;

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return new Response(JSON.stringify({ success: false, message: "Invalid token" }), { status: 401 });
    }

    const body = await req.json();

    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    // Remove existing slug from request body to avoid overwrite
    delete body.userProfileSlug;

    if (body.companyName) {
      const slugifiedCompany = slugify(body.companyName, { lower: true, strict: true });
      const last6OfId = existingUser._id.toString().slice(-6); // last 6 characters
      body.userProfileSlug = `${slugifiedCompany}-${last6OfId}`;
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.id, body, {
      new: true,
      runValidators: true,
    });

    return new Response(JSON.stringify({ success: true, user: updatedUser }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: "Error updating user", error: error.message }), { status: 500 });
  }
}