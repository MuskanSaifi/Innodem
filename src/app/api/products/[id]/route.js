// File: src/app/api/products/[id]/route.js

import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectdb from "@/lib/dbConnect";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import User from "@/models/User";
import BusinessProfile from "@/models/BusinessProfile";

export async function GET(req, { params }) {
  try {
    await connectdb();

    // Fix: Await params before destructuring
    const { id } = await params; // <--- Changed this line

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("userId", "fullname companyName _id")
      .select("-__v");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const businessProfile = await BusinessProfile.findOne({ userId: product.userId._id }).select("-__v");

    const formattedProduct = {
      ...product.toObject(),
      businessProfile: businessProfile ? businessProfile.toObject() : null,
      images: product.images?.filter((img) => img && (img.url || img.data)).map((img) =>
        img.url
          ? img.url
          : `data:${img.contentType};base64,${Buffer.from(img.data).toString("base64")}`
      ),
    };

    let relatedProducts = [];
    const maxRelatedProducts = 4;

    const relatedProductSelectFields =
      "name images tradeShopping minimumOrderQuantity specifications description userId";

    const relatedProductPopulate = [
      { path: "category", select: "name" },
      { path: "userId", select: "fullname companyName _id" }
    ];

    if (product.category) {
      relatedProducts = await Product.find({
        category: product.category._id,
        _id: { $ne: product._id },
      })
        .populate(relatedProductPopulate)
        .select(relatedProductSelectFields)
        .limit(maxRelatedProducts);
    }

    if (relatedProducts.length < maxRelatedProducts && product.subCategory) {
      const moreRelated = await Product.find({
        subCategory: product.subCategory._id,
        _id: { $ne: product._id },
        _id: { $nin: relatedProducts.map(p => p._id) }
      })
        .populate(relatedProductPopulate)
        .select(relatedProductSelectFields)
        .limit(maxRelatedProducts - relatedProducts.length);
      relatedProducts = [...relatedProducts, ...moreRelated];
    }

    const relatedProductsWithBusinessProfiles = await Promise.all(relatedProducts.map(async (rp) => {
      const rpBusinessProfile = rp.userId ? await BusinessProfile.findOne({ userId: rp.userId._id }).select("gstNumber yearOfEstablishment").lean() : null;
      return {
        ...rp.toObject(),
        businessProfile: rpBusinessProfile,
        images: rp.images?.filter((img) => img && (img.url || img.data)).map((img) =>
          img.url
            ? img.url
            : `data:${img.contentType};base64,${Buffer.from(img.data).toString("base64")}`
        ),
      };
    }));

    return NextResponse.json({ ...formattedProduct, relatedProducts: relatedProductsWithBusinessProfiles }, { status: 200 });
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}