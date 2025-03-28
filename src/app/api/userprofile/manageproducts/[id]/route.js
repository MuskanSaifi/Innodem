import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import { requireSignIn } from "@/middlewares/requireSignIn";
import Product from "@/models/Product";

import cloudinary from "@/lib/cloudinary";

// ✅ Upload Image to Cloudinary Function
const uploadToCloudinary = async (image) => {
  if (!image.startsWith("data:image")) {
    return image; // Return existing URL if it's already uploaded
  }

  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "products",
      resource_type: "image", // Ensure it's an image upload
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    return result.secure_url; // Return Cloudinary URL
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

export async function PATCH(req) {
  try {
    await connectdb();
    const user = await requireSignIn(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, images = [], ...updateFields } = body;

    if (!productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // ✅ Upload new images if they are Base64
    let newImages = [];
    if (images.length > 0) {
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          return img.startsWith("data:image") ? await uploadToCloudinary(img) : img;
        })
      );
      newImages = uploadedImages;
    }

    // ✅ Ensure images match schema [{ url: "image_url" }]
    updateFields.images = newImages.map((img) => ({ url: img })); 

    // ✅ Update Product
    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, userId: user.id },
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json({ success: true, message: "Product updated successfully", data: updatedProduct }, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}




export async function DELETE(req, context) {
  try {
    await connectdb();

    // Authenticate user
    // const user = await requireSignIn(req);
    // if (!user) {
    //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    // }

    // ✅ Await params correctly
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Ensure the user owns the product
    // if (product.userId.toString() !== user.id) {
    //   return NextResponse.json({ success: false, message: "Unauthorized to delete this product" }, { status: 403 });
    // }

    // Delete the product
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

