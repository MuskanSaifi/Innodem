
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import slugify from "slugify"; // Make sure this is installed via npm
import cloudinary from "@/lib/cloudinary";


const uploadUserImage = async (image) => {
  if (!image.startsWith("data:image")) return { url: image, public_id: null };

  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "user",
      resource_type: "image",
      transformation: [{ width: 300, height: 300, crop: "limit" }],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    console.error("Cloudinary upload failed", err);
    throw new Error("User image upload failed");
  }
};



export async function PATCH(req) {
  try {
    await connectdb();

    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader) {
      return new Response(JSON.stringify({ success: false, message: "No token provided" }), { status: 401 });
    }

    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await req.json();

    const existingUser = await User.findById(decoded.id);
    if (!existingUser) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    delete body.userProfileSlug;

    // ✅ Check if a new image is being uploaded
    if (body.icon?.startsWith("data:image")) {
      // ✅ Delete the old image from Cloudinary
      if (existingUser.iconPublicId) {
        try {
          await cloudinary.v2.uploader.destroy(existingUser.iconPublicId);
        } catch (deleteError) {
          console.error("Failed to delete old image from Cloudinary", deleteError);
        }
      }

      // ✅ Upload new image
      const uploaded = await uploadUserImage(body.icon);
      body.icon = uploaded.url;
      body.iconPublicId = uploaded.public_id;
    }

    // ✅ Update profile slug if companyName is updated
    if (body.companyName) {
      const slugified = slugify(body.companyName, { lower: true, strict: true });
      const suffix = existingUser._id.toString().slice(-6);
      body.userProfileSlug = `${slugified}-${suffix}`;
    }

    const updatedUser = await User.findByIdAndUpdate(decoded.id, body, {
      new: true,
      runValidators: true,
    });

    return new Response(JSON.stringify({ success: true, user: updatedUser }), { status: 200 });

  } catch (error) {
    console.error("❌ User update error:", error);
    return new Response(JSON.stringify({ success: false, message: "Error updating user", error: error.message }), { status: 500 });
  }
}


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
    const user = await User.findById(decoded.id, "userProfileSlug icon fullname email mobileNumber alternateMobileNumber alternateEmail whatsappNumber designation  companyName  userPackage userPackageHistory isVerified supportPerson");
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
