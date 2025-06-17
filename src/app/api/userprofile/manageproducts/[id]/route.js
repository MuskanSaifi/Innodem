import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import { requireSignIn } from "@/middlewares/requireSignIn";
import Product from "@/models/Product";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

// ✅ Upload Image to Cloudinary Function
const uploadToCloudinary = async (image) => {
  if (!image.startsWith("data:image")) {
    return { url: image, public_id: null };
  }

  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "products",
      resource_type: "image",
      transformation: [{ width: 500, height: 500, crop: "limit" }],
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

// ✅ PATCH: Update Product
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

    const existingImages = existingProduct.images || [];

    // ✅ Image Limit Check
    const totalImages = existingImages.length + images.length;
    if (totalImages > 4) {
      return NextResponse.json({
        success: false,
        message: "Image upload limit exceeded (Max 4 images allowed)",
      }, { status: 400 });
    }

    // ✅ Upload new images
    const uploadedImages = await Promise.all(
      images.map(async (img) => {
        return img.startsWith("data:image") ? await uploadToCloudinary(img) : { url: img, public_id: null };
      })
    );

    const finalImages = [
      ...existingImages,
      ...uploadedImages
    ];

    updateFields.images = finalImages;

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: productId, userId: user.id },
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error updating product:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}

// ✅ DELETE: Delete Product and its Cloudinary images
export async function DELETE(req, context) {
  try {
    await connectdb();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // ✅ Delete product images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
          } catch (err) {
            console.warn(`⚠️ Failed to delete Cloudinary image with public_id: ${image.public_id}`);
          }
        }
      }
    }

    const userId = product.userId;

    // ✅ Delete product from DB
    await Product.findByIdAndDelete(id);

    // ✅ Remove reference from user
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $pull: { products: id }
      });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
