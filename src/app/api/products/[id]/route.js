import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectdb from "@/lib/dbConnect";

export async function GET(req, { params }) {
  try {
    await connectdb();

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    console.log(`🔍 Fetching product with ID: ${id}`);

    // ✅ Fetch product with category, subcategory, and images populated
    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .select("-__v");

    if (!product) {
      console.log(`❌ Product not found for ID: ${id}`);
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // ✅ Format product images properly
    const formattedProduct = {
      ...product.toObject(),
      images: product.images
        .filter((img) => img && (img.url || img.data)) // ✅ Remove null images
        .map((img) =>
          img.url
            ? img.url // ✅ Return URL if available
            : `data:${img.contentType};base64,${Buffer.from(img.data).toString("base64")}`
        ),
    };

    console.log(`✅ Product fetched successfully`);
    return NextResponse.json(formattedProduct, { status: 200 });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

