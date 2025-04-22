import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";

export async function GET(request, { params }) {
  // Ensure params are awaited properly for dynamic routes
  await connectdb();

  // Await params if needed (awaiting in async route context)
  const { productslug } = await params; // await here to properly access params

  if (!productslug) {
    return NextResponse.json(
      { message: "Product slug is required", success: false },
      { status: 400 }
    );
  }

  try {
    const decodedProductSlug = decodeURIComponent(productslug);

    // Find the product by its slug
    const product = await Product.findOne({ productslug: decodedProductSlug })
      .populate("subCategory category");

    if (!product) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    // Fetch the subcategories based on the product's category
    const subcategories = await SubCategory.find({ category: product.category })
      .populate("category");

    // Fetch related products that share the same subcategory
    const relatedProducts = await Product.find({
      subCategory: product.subCategory,
      _id: { $ne: product._id }, // Exclude the current product
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
    return NextResponse.json(
      { message: "Server error", success: false, error: error.message },
      { status: 500 }
    );
  }
}
