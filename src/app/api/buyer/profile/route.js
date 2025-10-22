import connectdb from "@/lib/dbConnect";
import Buyer from "@/models/Buyer";
import jwt from "jsonwebtoken";
import slugify from "slugify";
import cloudinary from "@/lib/cloudinary";

// Allow larger payloads for image upload
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};

// Helper: upload image to Cloudinary
const uploadBuyerImage = async (image) => {
  if (!image || typeof image !== "string" || !image.startsWith("data:image")) {
    console.log("No new base64 image provided, or image is already a URL/invalid format. Skipping upload.");
    return { url: image, public_id: null };
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "buyer",
      resource_type: "image",
      transformation: [{ width: 300, height: 300, crop: "limit" }],
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (err) {
    console.error("❌ Cloudinary upload failed:", err);
    throw new Error(`Buyer image upload failed: ${err.message}`);
  }
};

// PATCH → Update Buyer Profile
export async function PATCH(req) {
  try {
    await connectdb();

    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader)
      return new Response(JSON.stringify({ success: false, message: "No token provided" }), { status: 401 });

    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await req.json();

    const existingBuyer = await Buyer.findById(decoded.id);
    if (!existingBuyer)
      return new Response(JSON.stringify({ success: false, message: "Buyer not found" }), { status: 404 });

    // Prevent direct update of slug
    delete body.buyerProfileSlug;

    // Handle buyer image
    if (body.image && typeof body.image === "string" && body.image.startsWith("data:image")) {
      if (existingBuyer.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existingBuyer.imagePublicId);
          console.log("Old image deleted successfully.");
        } catch (err) {
          console.error("❌ Failed to delete old image:", err);
        }
      }

      const uploaded = await uploadBuyerImage(body.image);
      body.image = uploaded.url;
      body.imagePublicId = uploaded.public_id;
    } else if (body.image === null || body.image === "") {
      if (existingBuyer.imagePublicId) {
        try {
          await cloudinary.uploader.destroy(existingBuyer.imagePublicId);
        } catch (err) {
          console.error("❌ Failed to delete removed image:", err);
        }
      }
      body.image = null;
      body.imagePublicId = null;
    } else {
      // No change in image
      body.image = existingBuyer.image;
      body.imagePublicId = existingBuyer.imagePublicId;
    }

    // Generate buyer slug if name/companyName changes
    if (body.fullname && (body.fullname !== existingBuyer.fullname || !existingBuyer.buyerProfileSlug)) {
      const slugified = slugify(body.fullname, { lower: true, strict: true });
      const suffix = existingBuyer._id.toString().slice(-6);
      body.buyerProfileSlug = `${slugified}-${suffix}`;
    }

    const updatedBuyer = await Buyer.findByIdAndUpdate(decoded.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBuyer)
      return new Response(JSON.stringify({ success: false, message: "Buyer not found after update." }), { status: 404 });

    return new Response(JSON.stringify({ success: true, buyer: updatedBuyer }), { status: 200 });
  } catch (error) {
    console.error("❌ Buyer update error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error updating buyer profile", error: error.message }),
      { status: 500 }
    );
  }
}

// GET → Fetch Buyer Profile
export async function GET(req) {
  try {
    await connectdb();

    const authorizationHeader = req.headers.get("Authorization");
    if (!authorizationHeader)
      return new Response(JSON.stringify({ success: false, message: "No token provided" }), { status: 401 });

    const token = authorizationHeader.startsWith("Bearer ")
      ? authorizationHeader.split(" ")[1]
      : authorizationHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const buyer = await Buyer.findById(
      decoded.id,
      "buyerProfileSlug fullname email mobileNumber countryCode companyName designation image isVerified"
    );

    if (!buyer)
      return new Response(JSON.stringify({ success: false, message: "Buyer not found" }), { status: 404 });

    return new Response(JSON.stringify({ success: true, buyer }), { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching buyer profile:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching buyer", error: error.message }),
      { status: 500 }
    );
  }
}
