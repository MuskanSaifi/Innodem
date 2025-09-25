// api/products/[id]/route.js
import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectdb from "@/lib/dbConnect";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import User from "@/models/User";
import BusinessProfile from "@/models/BusinessProfile";
import BlockedUser from "@/models/BlockedUser";

export async function GET(req, { params }) {
  try {
    await connectdb();

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // 👇 current user id nikal lo (yahan query param se le raha hu)
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    let blockedSellerIds = [];
    if (userId) {
      const blockedSellers = await BlockedUser.find({ blockedBy: userId }).select("sellerId");
      blockedSellerIds = blockedSellers.map((b) => b.sellerId.toString());
    }

    // 👇 product fetch karo but blocked seller ka product kabhi na mile
    const product = await Product.findOne({
      _id: id,
      userId: { $nin: blockedSellerIds },
    })
      .populate("category", "name categoryslug icon")
      .populate("subCategory", "name subcategoryslug icon")
      .populate("userId", "fullname companyName _id")
      .select("-__v");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const businessProfile = await BusinessProfile.findOne({
      userId: product.userId._id,
    }).select("-__v");

    const formattedProduct = {
      ...product.toObject(),
      businessProfile: businessProfile ? businessProfile.toObject() : null,
      images: product.images?.filter((img) => img && img.url).map((img) => img.url),
    };

    // --- Related Products ---
    let relatedProducts = [];
    const maxRelatedProducts = 12;

    const relatedProductSelectFields =
      "name images tradeShopping minimumOrderQuantity specifications description userId";

    const relatedProductPopulate = [
      { path: "category", select: "name" },
      { path: "userId", select: "fullname companyName _id" },
    ];

    // 1. Same subCategory
    if (product.subCategory) {
      relatedProducts = await Product.find({
        subCategory: product.subCategory._id,
        _id: { $ne: product._id },
        userId: { $nin: blockedSellerIds }, // 👈 filter
      })
        .populate(relatedProductPopulate)
        .select(relatedProductSelectFields)
        .limit(maxRelatedProducts);
    }

    // 2. Same category
    if (relatedProducts.length < maxRelatedProducts && product.category) {
      const moreRelated = await Product.find({
        category: product.category._id,
        _id: { $ne: product._id },
        _id: { $nin: relatedProducts.map((p) => p._id) },
        userId: { $nin: blockedSellerIds }, // 👈 filter
      })
        .populate(relatedProductPopulate)
        .select(relatedProductSelectFields)
        .limit(maxRelatedProducts - relatedProducts.length);
      relatedProducts = [...relatedProducts, ...moreRelated];
    }

    // 3. General products
    if (relatedProducts.length < maxRelatedProducts) {
      const remainingSlots = maxRelatedProducts - relatedProducts.length;
      const excludedProductIds = new Set([
        ...relatedProducts.map((p) => p._id.toString()),
        product._id.toString(),
      ]);

      const generalRelated = await Product.find({
        _id: { $nin: Array.from(excludedProductIds) },
        userId: { $nin: blockedSellerIds }, // 👈 filter
      })
        .populate(relatedProductPopulate)
        .select(relatedProductSelectFields)
        .limit(remainingSlots);
      relatedProducts = [...relatedProducts, ...generalRelated];
    }

    const relatedProductsWithBusinessProfiles = await Promise.all(
      relatedProducts.map(async (rp) => {
        const rpBusinessProfile = rp.userId
          ? await BusinessProfile.findOne({ userId: rp.userId._id })
              .select("gstNumber yearOfEstablishment")
              .lean()
          : null;
        return {
          ...rp.toObject(),
          businessProfile: rpBusinessProfile,
          images: rp.images?.filter((img) => img && img.url).map((img) => img.url),
        };
      })
    );

    // --- Related Categories ---
    let relatedCategories = [];
    const maxCategoriesToShow = 18;

    const currentCategoryId = product.category?._id;
    const currentSubCategoryId = product.subCategory?._id;

    if (currentCategoryId) {
      const subCategories = await SubCategory.find({
        category: currentCategoryId,
        _id: { $ne: currentSubCategoryId },
      })
        .populate("category", "categoryslug")
        .select("name subcategoryslug icon")
        .limit(maxCategoriesToShow);

      relatedCategories = [
        ...subCategories.map((sub) => ({
          _id: sub._id,
          name: sub.name,
          slug: `${sub.category.categoryslug}/${sub.subcategoryslug}`,
          image: sub.icon || "/placeholder-category.png",
          type: "subcategory",
        })),
      ];
    }

    if (relatedCategories.length < maxCategoriesToShow) {
      const remainingSlots = maxCategoriesToShow - relatedCategories.length;
      const alreadyIncludedProductSlugs = new Set(
        relatedCategories
          .filter((item) => item.type === "product_as_category_display")
          .map((item) => item.slug)
      );

      const productsForCategoriesDisplay = await Product.find({
        _id: { $ne: product._id },
        "images.0": { $exists: true },
        productslug: { $nin: Array.from(alreadyIncludedProductSlugs) },
        userId: { $nin: blockedSellerIds }, // 👈 filter
      })
        .select("name images productslug")
        .limit(remainingSlots);

      productsForCategoriesDisplay.forEach((p) => {
        if (relatedCategories.length < maxCategoriesToShow) {
          relatedCategories.push({
            _id: p._id,
            name: p.name,
            slug: p.productslug || p._id.toString(),
            image: p.images?.[0]?.url || "/placeholder-product.png",
            type: "product_as_category_display",
          });
        }
      });
    }

    const formattedRelatedCategories = relatedCategories.map((item) => ({
      _id: item._id,
      name: item.name,
      slug: item.slug,
      image: item.image,
      type: item.type,
    }));

    return NextResponse.json(
      {
        ...formattedProduct,
        relatedProducts: relatedProductsWithBusinessProfiles,
        relatedCategories: formattedRelatedCategories,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
