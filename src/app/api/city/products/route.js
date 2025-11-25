// app/api/city/products/route.js
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectdb();

    const { searchParams } = new URL(req.url);
    const city = searchParams.get("city");
    const product = searchParams.get("product");

    if (!city || !product) {
      return NextResponse.json(
        { message: "City and product parameters are required" },
        { status: 400 }
      );
    }

    const products = await Product.find({
      city: { $regex: `^${city}$`, $options: "i" },
      name: { $regex: product, $options: "i" },
    })
      .populate("userId", "companyName mobileNumber email")
      .populate("category")
      .populate("subCategory");

    if (!products.length) {
      return NextResponse.json(
        { message: "No matching products found" },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching product list:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
