import { NextResponse } from "next/server";
import Product from "@/models/Product";
import connectdb from "@/lib/dbConnect";
import Category from "@/models/Category"; // Make sure Category model is imported and defined correctly
import SubCategory from "@/models/SubCategory";
import User from "@/models/User";
import BusinessProfile from "@/models/BusinessProfile";

export async function GET(req, { params }) {
  try {
    await connectdb();

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const product = await Product.findById(id)
      .populate("category", "name categoryslug icon")
      .populate("subCategory", "name subcategoryslug icon")
      .populate("userId", "fullname companyName _id")
      .select("-__v");

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const businessProfile = await BusinessProfile.findOne({ userId: product.userId._id }).select("-__v");

    const formattedProduct = {
      ...product.toObject(),
      businessProfile: businessProfile ? businessProfile.toObject() : null,
      images: product.images?.filter((img) => img && img.url).map((img) => img.url),
    };

    let relatedProducts = [];
    const maxRelatedProducts = 12; // Max number of related products to fetch

    const relatedProductSelectFields =
      "name images tradeShopping minimumOrderQuantity specifications description userId";

    const relatedProductPopulate = [
      { path: "category", select: "name" },
      { path: "userId", select: "fullname companyName _id" }
    ];

    // --- Strategy for Related Products ---
    // 1. Fetch related products by the exact subCategory of the current product (highest priority)
    if (product.subCategory) {
      relatedProducts = await Product.find({
        subCategory: product.subCategory._id,
        _id: { $ne: product._id }, // Exclude current product
      })
        .populate(relatedProductPopulate)
        .select(relatedProductSelectFields)
        .limit(maxRelatedProducts);
    }

    // 2. If not enough products from the subcategory, then fetch from the main category
    if (relatedProducts.length < maxRelatedProducts && product.category) {
      const moreRelated = await Product.find({
        category: product.category._id,
        _id: { $ne: product._id }, // Exclude current product
        _id: { $nin: relatedProducts.map(p => p._id) } // Exclude already fetched products
      })
        .populate(relatedProductPopulate)
        .select(relatedProductSelectFields)
        .limit(maxRelatedProducts - relatedProducts.length);
      relatedProducts = [...relatedProducts, ...moreRelated];
    }
    
    // 3. Optional: If still not enough, fetch popular/trending products from other categories
    if (relatedProducts.length < maxRelatedProducts) {
        const remainingSlots = maxRelatedProducts - relatedProducts.length;
        const excludedProductIds = new Set([...relatedProducts.map(p => p._id.toString()), product._id.toString()]);
        
        const generalRelated = await Product.find({
            _id: { $nin: Array.from(excludedProductIds) },
            // Add conditions for popular/trending if you have a 'views' count or 'isTrending' flag
            // For example: views: { $gt: 100 }
        })
        .populate(relatedProductPopulate)
        .select(relatedProductSelectFields)
        .limit(remainingSlots);
        relatedProducts = [...relatedProducts, ...generalRelated];
    }


    const relatedProductsWithBusinessProfiles = await Promise.all(relatedProducts.map(async (rp) => {
      const rpBusinessProfile = rp.userId ? await BusinessProfile.findOne({ userId: rp.userId._id }).select("gstNumber yearOfEstablishment").lean() : null;
      return {
        ...rp.toObject(),
        businessProfile: rpBusinessProfile,
        images: rp.images?.filter((img) => img && img.url).map((img) => img.url),
      };
    }));

    // --- Logic for "Explore More in Similar Categories" (MODIFIED) ---
    let relatedCategories = [];
    const maxCategoriesToShow = 18; // Max number of categories to show

    const currentCategoryId = product.category?._id;
    const currentSubCategoryId = product.subCategory?._id;

    // Strategy 1: ONLY Fetch other subcategories within the current product's main category
    if (currentCategoryId) {
      const subCategories = await SubCategory.find({
        category: currentCategoryId,
        _id: { $ne: currentSubCategoryId } // Exclude the current subcategory itself
      })
        .populate("category", "categoryslug") // IMPORTANT: Populate the category to get its slug
        .select("name subcategoryslug icon")
        .limit(maxCategoriesToShow);
      
      relatedCategories = [...subCategories.map(sub => ({ 
        _id: sub._id,
        name: sub.name,
        // CONSTRUCT THE DESIRED SLUG HERE:
        slug: `${sub.category.categoryslug}/${sub.subcategoryslug}`,
        image: sub.icon || "/placeholder-category.png",
        type: 'subcategory' // Explicitly mark as subcategory
      }))];
    }

    // Optional fallback: Fill remaining slots with representative products if needed
    // This is for visual variety in the "Explore Categories" section if actual subcategories are scarce.
    if (relatedCategories.length < maxCategoriesToShow) {
      const remainingSlots = maxCategoriesToShow - relatedCategories.length;
      const alreadyIncludedProductSlugs = new Set(relatedCategories.filter(item => item.type === 'product_as_category_display').map(item => item.slug));
      
      const productsForCategoriesDisplay = await Product.find({
        _id: { $ne: product._id }, // Exclude current product
        "images.0": { $exists: true }, // Ensure it has at least one image
        productslug: { $nin: Array.from(alreadyIncludedProductSlugs) } // Avoid duplicates if a product link is directly added
      })
      .select("name images productslug")
      .limit(remainingSlots);

      productsForCategoriesDisplay.forEach(p => {
        if (relatedCategories.length < maxCategoriesToShow) {
          relatedCategories.push({
            _id: p._id,
            name: p.name,
            slug: p.productslug || p._id.toString(), // Link to product page
            image: p.images?.[0]?.url || "/placeholder-product.png",
            type: 'product_as_category_display' // Indicate this is a product displayed as a category link
          });
        }
      });
    }

    // Final formatting for the frontend
    const formattedRelatedCategories = relatedCategories.map(item => ({
      _id: item._id,
      name: item.name,
      slug: item.slug,
      image: item.image,
      type: item.type, // 'subcategory' or 'product_as_category_display'
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