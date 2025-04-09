import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";

export async function GET(request, { params }) {
  await connectdb();

  const rawProductName = params?.productname;

  if (!rawProductName) {
    return NextResponse.json({ message: "Product name is required" }, { status: 400 });
  }

  const productname = decodeURIComponent(rawProductName)
    .replace(/-+$/, "")
    .replace(/-+/g, " ")
    .trim();

  try {
    const product = await Product.findOne({
      name: { $regex: new RegExp(productname, "i") }, // <- removed `^` and `$`
    }).populate("subCategory category");

    if (!product) {
      return NextResponse.json({ message: "Product not found", success: false }, { status: 404 });
    }

    const subcategories = await SubCategory.find({ category: product.category }).populate("category");

    const relatedProducts = await Product.find({
      subCategory: product.subCategory,
      _id: { $ne: product._id },
    }).limit(5);

    return NextResponse.json(
      {
        success: true,
        product,
        subcategories,
        relatedProducts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
  }
}

