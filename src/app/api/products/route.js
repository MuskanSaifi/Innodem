import { NextResponse } from "next/server";
import SubCategory from "@/models/SubCategory";
import Product from "@/models/Product";
import connectdb from "@/lib/dbConnect";

export async function GET(req) {
  try {
    // ✅ Ensure database is connected
    await connectdb();

    // ✅ Extract subcategory name from the request
    const { searchParams } = new URL(req.url);
    const subcategoryName = searchParams.get("subcategory");

    if (!subcategoryName) {
      return NextResponse.json(
        { error: "Subcategory name is required" },
        { status: 400 }
      );
    }

    console.log("🔍 Searching for subcategory:", subcategoryName);

    // ✅ Find the subcategory using a case-insensitive partial match
    const subcategory = await SubCategory.findOne({
      name: { $regex: new RegExp(`^.*${subcategoryName}.*$`, "i") }, // Matches any part of the name
    });
    

    if (!subcategory) {
      console.log(`❌ Subcategory not found: ${subcategoryName}`);
      return NextResponse.json(
        { error: `Subcategory '${subcategoryName}' not found` },
        { status: 404 }
      );
    }

    console.log(`✅ Found subcategory: ${subcategory.name}`);

    // ✅ Fetch products linked to the subcategory
    const products = await Product.find({ subCategory: subcategory._id })
      .populate("category", "name") // Populate category details
      .populate("subCategory", "name") // Populate subcategory details
      .select("-__v"); // Exclude unnecessary fields

    console.log(`✅ Fetched ${products.length} products`);

    return NextResponse.json(products, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
