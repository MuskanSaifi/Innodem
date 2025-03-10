import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subcategoryName = searchParams.get("subcategory"); // ✅ Get subcategory

    if (!subcategoryName) {
      return NextResponse.json({ success: false, error: "Subcategory is required" }, { status: 400 });
    }

    // Fetch categories with subcategories and products
    const categories = await Category.find()
      .populate({
        path: "subcategories",
        populate: { path: "products" },
      });

    let matchedProducts = [];

    // Find matching subcategory and its products
    categories.forEach((category) => {
      category.subcategories.forEach((subCategory) => {
        if (subCategory.name.toLowerCase() === subcategoryName.toLowerCase()) {
          matchedProducts = subCategory.products.map((product) => ({
            ...product._doc,
            category: category.name,
            subcategory: subCategory.name,
            images: product.images.map((img) => ({
              data: img.data.toString("base64"),
              contentType: img.contentType,
            })),
          }));
        }
      });
    });

    return NextResponse.json({ success: true, products: matchedProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products." }, { status: 500 });
  }
}
