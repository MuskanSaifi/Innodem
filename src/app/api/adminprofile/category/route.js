import mongoose from "mongoose";
import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category"; // Assuming you have the Category model
import SubCategory from "@/models/SubCategory";
import Product from "@/models/Product"; // ✅ Import Product to ensure it's registered

import { URL } from "url";  // Import URL for parsing query


import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// ✅ Validate AWS Credentials Before Initialization
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION || !process.env.AWS_BUCKET_NAME) {
  throw new Error("❌ AWS Credentials Missing! Check your .env file.");
}

// ✅ Initialize AWS S3 Client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// ✅ Function to Upload Image to AWS S3
const uploadToS3 = async (image) => {
  console.log("🔍 Checking Image Type:", image);

  if (typeof image !== "string") {
    throw new Error("❌ Invalid Image Format: Image must be a string (Base64 or URL)");
  }

  if (image.startsWith("http")) {
    return image; // ✅ Already a valid URL, return as is
  }

  if (!image.includes(",")) {
    throw new Error("❌ Invalid Image Format: Expected Base64 string");
  }

  const base64Image = image.split(",")[1]; // Extract Base64 Data
  if (!base64Image) throw new Error("❌ Invalid Image Data");

  const buffer = Buffer.from(base64Image, "base64");
  const key = `categories/${Date.now()}.jpg`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: "image/jpeg",
  };

  // ✅ Upload to S3
  const command = new PutObjectCommand(uploadParams);
  await s3.send(command);

  // ✅ Return the uploaded file URL
  return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export async function PATCH(req) {
  try {
    await connectDB(); // Ensure DB connection
    const body = await req.json();
    const { id, name, icon, subcategories } = body;

    // ✅ Validate if ID is provided and a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid category ID." }), {
        status: 400,
      });
    }

    // ✅ Find existing category
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return new Response(JSON.stringify({ error: "Category not found." }), { status: 404 });
    }

    let uploadedIconUrl = existingCategory.icon; // Default to existing icon

    // ✅ Upload new image if a new one is provided
    if (icon && icon !== existingCategory.icon) {
      uploadedIconUrl = await uploadToS3(icon);
    }

    // ✅ Update category with new image
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, icon: uploadedIconUrl, subcategories },
      { new: true, runValidators: true }
    );

    return new Response(JSON.stringify(updatedCategory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("❌ Error updating category:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update category." }),
      { status: 500 }
    );
  }
}



// Create category
export async function POST(req) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return new Response(
        JSON.stringify({ error: "Name is required." }),
        { status: 400 }
      );
    }

    // Validate that subcategories (if provided) are valid ObjectIds
    if (
      body.subcategories &&
      (!Array.isArray(body.subcategories) ||
        body.subcategories.some(
          (subcategory) => !mongoose.Types.ObjectId.isValid(subcategory)
        ))
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid subcategories provided." }),
        { status: 400 }
      );
    }

    // Create a new category
    const newCategory = new Category({
      name: body.name,
      icon: body.icon || null, // Optional icon
      isTrending: body.isTrending,
      subcategories: body.subcategories || [], // Default to an empty array if not provided
    });

    // Save the category
    const savedCategory = await newCategory.save();

    return new Response(JSON.stringify(savedCategory), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to create category." }),
      { status: 500 }
    );
  }
}


// Get All Categories
export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find()
      .populate({
        path: "subcategories",
        populate: {
          path: "products",
          select: "name price images",
        },
      })
      .exec();

    if (!categories.length) {
      return new Response(JSON.stringify({ message: "No categories found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(categories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch categories" }),
      { status: 500 }
    );
  }
}


// Delete Category by ID
export async function DELETE(req) {
  try {
    // Parse the query parameter from the request URL
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return new Response(
        JSON.stringify({ error: "Category ID is required" }),
        { status: 400 }
      );
    }

    // Convert id to ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    await connectDB(); // Ensure DB connection

    const deletedCategory = await Category.findByIdAndDelete(objectId); // Find and delete the category by ID

    if (!deletedCategory) {
      return new Response(
        JSON.stringify({ error: "Category not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Category deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to delete category" }),
      { status: 500 }
    );
  }
}