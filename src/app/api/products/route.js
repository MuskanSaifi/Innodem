import connectDB from "@/lib/dbConnect";
import Category from "@/models/Category";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    // Extract product name from query parameters
    const { searchParams } = new URL(req.url);
    const productName = searchParams.get("name");

    if (!productName) {
      return NextResponse.json({ success: false, error: "Product name is required" }, { status: 400 });
    }

    // Fetch categories with subcategories and products
    const categories = await Category.find()
      .populate({
        path: "subcategories",
        populate: { path: "products" },
      });

    let matchedProducts = [];

    // Loop through categories and subcategories to find matching products
    categories.forEach((category) => {
      category.subcategories.forEach((subCategory) => {
        subCategory.products.forEach((product) => {
          if (product.name.toLowerCase().includes(productName.toLowerCase())) {
            matchedProducts.push({
              ...product._doc,
              category: category.name,
              subcategory: subCategory.name,
              images: product.images.map((img) => ({
                data: img.data.toString("base64"),
                contentType: img.contentType,
              })),
            });
          }
        });
      });
    });

    return NextResponse.json({ success: true, products: matchedProducts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products by name:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products." }, { status: 500 });
  }
}
