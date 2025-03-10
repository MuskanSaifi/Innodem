import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectdb from "@/lib/dbConnect";

export async function GET(req) {
  try {
    await connectdb();

    const { searchParams } = new URL(req.url);
    const searchQuery = searchParams.get("subcategory");

    if (!searchQuery) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    console.log(`🔍 Searching for: ${searchQuery}`);

    // ✅ Fetch products including category, subcategory, and images
    const products = await Product.find({ name: { $regex: searchQuery, $options: "i" } })
      .populate("category", "name")
      .populate("subCategory", "name")
      .select("-__v");

    if (products.length === 0) {
      console.log(`❌ No products found for: ${searchQuery}`);
      return NextResponse.json({ error: "No products found" }, { status: 404 });
    }

    // ✅ Convert image Buffer data to Base64
    const formattedProducts = products.map((product) => ({
      ...product.toObject(),
      images: product.images.map((img) =>
        img.data
          ? `data:${img.contentType};base64,${img.data.toString("base64")}`
          : null
      ),
    }));

    console.log(`✅ Found ${products.length} products`);
    return NextResponse.json(formattedProducts, { status: 200 });

  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
