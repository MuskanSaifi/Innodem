// File: src/app/api/products/[id]/route.js

import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectdb from "@/lib/dbConnect";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import User from "@/models/User";


export async function GET(req, { params }) {
  try {
    await connectdb();

const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("userId", "fullname companyName")
      .select("-__v");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formattedProduct = {
      ...product.toObject(),
      images: product.images?.filter((img) => img && (img.url || img.data)).map((img) =>
        img.url
          ? img.url
          : `data:${img.contentType};base64,${Buffer.from(img.data).toString("base64")}`
      ),
    };

    return NextResponse.json(formattedProduct, { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
