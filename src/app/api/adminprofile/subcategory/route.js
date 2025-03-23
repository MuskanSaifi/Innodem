// API Functions
import mongoose from "mongoose";
import connectDB from "@/lib/dbConnect";
import SubCategory from "@/models/SubCategory";  // Import SubCategory model
import Product from "@/models/Product";          // Import Product model
import Category from "@/models/Category";        // Import Category model
import User from "@/models/User"; // ✅ Ensure User model is imported


import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

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
  if (typeof image !== "string") {
    throw new Error("❌ Invalid Image Format: Image must be a string (Base64 or URL)");
  }
  if (image.startsWith("http")) return image;
  if (!image.includes(",")) {
    throw new Error("❌ Invalid Image Format: Expected Base64 string");
  }

  const base64Image = image.split(",")[1];
  if (!base64Image) throw new Error("❌ Invalid Image Data");

  const buffer = Buffer.from(base64Image, "base64");
  const key = `subcategories/${Date.now()}.jpg`;

  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: "image/jpeg",
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    // ✅ Log the uploaded image URL
    const uploadedUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return uploadedUrl;
  } catch (error) {
    console.error("❌ S3 Upload Error:", error);
    throw new Error("Failed to upload image to S3.");
  }
};


// PATCH method - Update a subcategory
export async function PATCH(req) {
  try {
    await connectDB(); // Ensure DB connection
    const body = await req.json();
    const { id, name, category, products, icon } = body;

    // Validate Subcategory ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid subcategory ID." }), { status: 400 });
    }

    // Check if subcategory exists
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return new Response(JSON.stringify({ error: "Subcategory not found." }), { status: 404 });
    }

    // Validate Category ID
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return new Response(JSON.stringify({ error: "Invalid category ID." }), { status: 400 });
    }
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return new Response(JSON.stringify({ error: "Category not found." }), { status: 404 });
      }
    }

    // Validate Product IDs
    if (products && products.length > 0) {
      const invalidProducts = [];
      for (const productId of products) {
        if (!mongoose.Types.ObjectId.isValid(productId) || !(await Product.findById(productId))) {
          invalidProducts.push(productId);
        }
      }
      if (invalidProducts.length > 0) {
        return new Response(JSON.stringify({ error: `Invalid product IDs: ${invalidProducts.join(", ")}` }), { status: 400 });
      }
    }

    // Upload new image if provided
    let uploadedIconUrl = subCategory.icon;
    if (icon && icon !== subCategory.icon) {
      uploadedIconUrl = await uploadToS3(icon);
    }

    // Update Subcategory
    subCategory.name = name?.trim() || subCategory.name;
    subCategory.category = category || subCategory.category;
    subCategory.products = products || subCategory.products;
    subCategory.icon = uploadedIconUrl;

    const updatedSubCategory = await subCategory.save();

    // Populate fields for response
    const populatedSubCategory = await SubCategory.findById(updatedSubCategory._id)
      .populate("category")
      .populate("products");

    return new Response(JSON.stringify(populatedSubCategory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Error updating subcategory:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update subcategory." }),
      { status: 500 }
    );
  }
}


// POST method - Create a new subcategory
export async function POST(req) {
  try {
    const body = await req.json();

    // Required fields validation
    const requiredFields = ["name", "category"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400 }
        );
      }
    }

    // Validate that the provided category ID is valid
    const categoryExists = await Category.findById(body.category);
    if (!categoryExists) {
      return new Response(
        JSON.stringify({ error: `Invalid category ID: ${body.category}` }),
        { status: 400 }
      );
    }

    // Validate that the provided product IDs are valid
    if (body.products && body.products.length > 0) {
      const invalidProducts = [];
      for (const productId of body.products) {
        const productExists = await Product.findById(productId);
        if (!productExists) {
          invalidProducts.push(productId);
        }
      }
      if (invalidProducts.length > 0) {
        return new Response(
          JSON.stringify({ error: `Invalid product IDs: ${invalidProducts.join(", ")}` }),
          { status: 400 }
        );
      }
    }

    // Connect to DB
    await connectDB();

    // Check if a subcategory with the same name already exists in the same category
    const existingSubCategory = await SubCategory.findOne({
      name: body.name.trim(),
      category: body.category,
    });

    if (existingSubCategory) {
      return new Response(
        JSON.stringify({ error: `Subcategory with name "${body.name}" already exists in this category.` }),
        { status: 400 }
      );
    }

    // Create and save the new subcategory
    const newSubCategory = new SubCategory({
      name: body.name.trim(),
      category: body.category,  // Reference to Category ID
      products: body.products,  // Array of product IDs
    });

    const savedSubCategory = await newSubCategory.save();

    // Populate the category and products fields
    const populatedSubCategory = await SubCategory.findById(savedSubCategory._id)
      .populate("category")
      .populate("products");

    return new Response(JSON.stringify(populatedSubCategory), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving subcategory:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to save subcategory" }),
      { status: 500 }
    );
  }
}




export async function GET(req) {
  try {
    await connectDB(); // Ensure DB connection

    const url = new URL(req.url);
    const categoryId = url.searchParams.get("categoryId");

    let subCategories;

    if (categoryId) {
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return new Response(
          JSON.stringify({ error: "Invalid category ID." }),
          { status: 400 }
        );
      }

      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return new Response(
          JSON.stringify({ error: `Category with ID ${categoryId} not found.` }),
          { status: 404 }
        );
      }

      subCategories = await SubCategory.find({ category: categoryId })
        .populate("category")
        .populate({
          path: "products",
          populate: { path: "userId", model: User, select: "fullname email" }, // ✅ Ensure userId is populated correctly
        });
    } else {
      subCategories = await SubCategory.find()
        .populate("category")
        .populate({
          path: "products",
          populate: { path: "userId", model: User, select: "fullname email" }, // ✅ Ensure userId is populated correctly
        });
    }

    return new Response(
      JSON.stringify(subCategories),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Error fetching subcategories:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch subcategories." }),
      { status: 500 }
    );
  }
}