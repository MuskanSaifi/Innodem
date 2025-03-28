import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import { requireSignIn } from "@/middlewares/requireSignIn";
import Product from "@/models/Product";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import User from "@/models/User";

import cloudinary from "@/lib/cloudinary"; // Import Cloudinary config

// ✅ Upload Image to Cloudinary Function
const uploadToCloudinary = async (image) => {
  if (typeof image !== "string") {
    throw new Error("❌ Invalid Image Format: Image must be a string (Base64 or URL)");
  }

  if (image.startsWith("http")) {
    return image; // ✅ Already a valid URL
  }

  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "products", // Save images in a folder named "products"
      transformation: [{ width: 500, height: 500, crop: "limit" }], // Resize image
    });

    return result.secure_url; // ✅ Return the uploaded image URL
  } catch (error) {
    console.error("❌ Cloudinary Upload Error:", error);
    throw new Error("Image upload failed");
  }
};

export async function POST(req) {
  try {
    await connectdb();
    
    // ✅ Authorization
    const user = await requireSignIn(req);
    if (!user) {
      console.error("❌ Authorization failed. User not found.");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ JSON Parsing with Error Handling
    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error("❌ JSON Parsing Error:", error);
      return NextResponse.json({ success: false, message: "Invalid JSON format" }, { status: 400 });
    }

    // ✅ Extracting Fields
    const {
      name,
      price,
      currency,
      minimumOrderQuantity,
      moqUnit,
      images,
      state,
      city,
      description = "",
      category,
      subCategory,
      stock = 0,
      tradeInformation = {},
      specifications = {},
      tradeShopping = {},
    } = body;
    

    // ✅ Validate Required Fields
    if (!name || !minimumOrderQuantity || !Array.isArray(images) || images.length === 0) {
      console.error("❌ Missing required fields:", { name, minimumOrderQuantity, images });
      return NextResponse.json({ success: false, message: "Required fields are missing" }, { status: 400 });
    }

    if (images.length > 5) {
      console.error("❌ Too many images:", images.length);
      return NextResponse.json({ success: false, message: "You can upload up to 5 images only" }, { status: 400 });
    }

    // ✅ Process Trade Pricing (Fixed vs Slab)
    if (!tradeShopping.sellingPriceType) {
      return NextResponse.json({ success: false, message: "Selling price type is required" }, { status: 400 });
    }

    let fixedSellingPrice = null;
    let slabPricing = [];

    if (tradeShopping.sellingPriceType === "Fixed") {
      if (!tradeShopping.fixedSellingPrice || isNaN(Number(tradeShopping.fixedSellingPrice))) {
        return NextResponse.json({ success: false, message: "Fixed selling price is required and must be a number" }, { status: 400 });
      }
      fixedSellingPrice = Number(tradeShopping.fixedSellingPrice); // Ensure it's saved as a number
    }
    else if (tradeShopping.sellingPriceType === "Slab Based") {
      if (!Array.isArray(tradeShopping.slabPricing) || tradeShopping.slabPricing.length === 0) {
        return NextResponse.json({ success: false, message: "Slab pricing details required" }, { status: 400 });
      }

      tradeShopping.slabPricing.forEach((slab, index) => {
        if (!slab.minQuantity || !slab.maxQuantity || !slab.price) {
          return NextResponse.json({ success: false, message: `Slab ${index + 1} is missing details` }, { status: 400 });
        }
        if (slab.minQuantity >= slab.maxQuantity) {
          return NextResponse.json({ success: false, message: `Slab ${index + 1}: Min quantity must be less than max quantity` }, { status: 400 });
        }
      });

      slabPricing = tradeShopping.slabPricing;
    } else {
      return NextResponse.json({ success: false, message: "Invalid selling price type" }, { status: 400 });
    }


    // ✅ Validate Category & SubCategory
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return NextResponse.json({ success: false, message: "Invalid category ID" }, { status: 400 });
    }

    let subCategoryExists = null;
    if (subCategory) {
      subCategoryExists = await SubCategory.findById(subCategory);
      if (!subCategoryExists) {
        return NextResponse.json({ success: false, message: "Invalid subCategory ID" }, { status: 400 });
      }
    }

    // Ensure images array contains valid strings
    const validImages = images.map((img) => {
      if (typeof img === "string") return img; // Already valid
      if (typeof img === "object" && img.url) return img.url; // Extract URL
      throw new Error("❌ Invalid Image Data: Each image must be a Base64 string or URL");
    });

    
    const imageUrls = await Promise.all(validImages.map(uploadToCloudinary));

    // ✅ Create & Save Product
    const newProduct = new Product({
      userId: user.id,
      name,
      price,
      currency,
      minimumOrderQuantity,
      moqUnit,
      images: imageUrls.map((url) => ({ url })),  // ✅ Convert to correct schema
      state,
      city,
      description,
      category: categoryExists._id,
      subCategory: subCategoryExists ? subCategoryExists._id : null,
      stock,
      tradeInformation,
      specifications: {
        ...specifications,
        foldable: specifications.foldable === "Yes",
      },
      tradeShopping: {
        sellingPriceType: tradeShopping.sellingPriceType,
        gst: Number(tradeShopping.gst) || null, 
        fixedSellingPrice: Number(tradeShopping.fixedSellingPrice) || null,  // ✅ Always store this
        slabPricing,
        isReturnable: tradeShopping.isReturnable === "Yes" ? "Yes" : "No", // ✅ Explicitly set
        shippingType: tradeShopping.shippingType || "Free", // Default to "Free"
        packageDimensions: {
          length: Number(tradeShopping.packageDimensions.length) || null,
          width: Number(tradeShopping.packageDimensions.width) || null,
          height: Number(tradeShopping.packageDimensions.height) || null,
          unit: tradeShopping.packageDimensions.unit || "cm",
      },
      },
            
    });


    await newProduct.save();
    await User.findByIdAndUpdate(user.id, { $push: { products: newProduct._id } });

    return NextResponse.json({ success: true, message: "Product created successfully", data: newProduct }, { status: 201 });

  } catch (error) {
    console.error("❌ Error creating product:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectdb();
    const user = await requireSignIn(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const products = await Product.find({ userId: user.id });

    if (!products.length) {
      return NextResponse.json({ success: false, message: "No products found" }, { status: 404 });
    }

    const productsWithDetails = products.map((product) => {
      // ✅ Ensure Image URL from Cloudinary or Placeholder
      let imageUrl = "https://via.placeholder.com/500"; // Default placeholder if no image exists
      if (product.images.length > 0 && product.images[0].url) {
        imageUrl = product.images[0].url; // Use Cloudinary URL directly
      }

      // ✅ Check if product has required details
      const hasDetails =
        product.price &&
        product.category &&
        product.description &&
        product.images.length > 0 &&
        Object.keys(product.specifications || {}).length > 0;

      // ✅ Improve Product Strength Calculation
      let strength = "Low";
      if ((product.stock > 50 || product.salesCount > 100) && hasDetails) {
        strength = "High";
      } else if ((product.stock > 20 || product.salesCount > 50) && hasDetails) {
        strength = "Medium";
      } else if (hasDetails) {
        strength = "Medium"; // Upgraded from Low to Medium if details exist
      }

      return { ...product._doc, image: imageUrl, strength };
    });

    return NextResponse.json({ success: true, products: productsWithDetails }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

