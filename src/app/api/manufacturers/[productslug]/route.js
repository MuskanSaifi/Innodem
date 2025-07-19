import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";
import BusinessProfile from "@/models/BusinessProfile";

export async function GET(request) {
  await connectdb();

  try {
    const url = new URL(request.url);
    const productslug = url.pathname.split("/").pop(); // ✅ Extract slug manually

    if (!productslug) {
      return NextResponse.json(
        { message: "Product slug is required", success: false },
        { status: 400 }
      );
    }

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

    const businessProfile = await BusinessProfile.findOne({ userId: baseProduct.userId });

    return NextResponse.json(
      {
        success: true,
        products,
        subcategories,
        relatedProducts,
        businessProfile,
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
