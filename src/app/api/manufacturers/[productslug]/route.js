// api/manufacturers/[productslug]/route.js
import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";
import BusinessProfile from "@/models/BusinessProfile"; // ✅ Import this

export async function GET(request, { params }) {
  await connectdb();

  const { productslug } = params;

  if (!productslug) {
    return NextResponse.json(
      { message: "Product slug is required", success: false },
      { status: 400 }
    );
  }

  try {
    const decodedProductSlug = decodeURIComponent(productslug);

    const products = await Product.find({ productslug: decodedProductSlug })
      .populate("subCategory category userId");

    if (!products || products.length === 0) {
      return NextResponse.json(
        { message: "Product(s) not found", success: false },
        { status: 404 }
      );
    }

    const baseProduct = products[0];

    const subcategories = await SubCategory.find({ category: baseProduct.category }).populate("category");

    const relatedProducts = await Product.find({
      subCategory: baseProduct.subCategory,
      _id: { $nin: products.map(p => p._id) },
    }).limit(5);

    // ✅ Get Business Profile of the seller
    const businessProfile = await BusinessProfile.findOne({ userId: baseProduct.userId });

    return NextResponse.json(
      {
        success: true,
        products,
        subcategories,
        relatedProducts,
        businessProfile, // ✅ Send this to frontend
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json(
      { message: "Server error", success: false, error: error.message },
      { status: 500 }
    );
  }
}