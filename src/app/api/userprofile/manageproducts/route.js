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
  // Debugging: Log the image data being received
  console.log("DEBUG: uploadToCloudinary received image (first 50 chars):", String(image).substring(0, 50) + "...");

  if (typeof image !== "string") {
    console.error("❌ Invalid Image Format: Image must be a string (Base64 or URL). Received type:", typeof image);
    throw new Error("❌ Invalid Image Format: Image must be a string (Base64 or URL)");
  }

  // Check if it's already a Cloudinary URL (or any http/https URL)
  // This is important because your frontend sends objects like { url: "data:..." }
  // You need to extract the base64 string from this object first.
  if (image.startsWith("http")) {
    console.log("DEBUG: Image is already an external URL, skipping Cloudinary upload.");
    return { url: image, public_id: null }; // No public_id for existing URL
  }

  try {
    const result = await cloudinary.v2.uploader.upload(image, {
      folder: "products", // Save images in a folder named "products"
      transformation: [{ width: 500, height: 500, crop: "limit" }], // Resize image
    });

    console.log("DEBUG: Cloudinary upload successful:", {
      secure_url: result.secure_url,
      public_id: result.public_id,
    });

    return {
      url: result.secure_url,
      public_id: result.public_id, // ✅ Save public_id
    };
  } catch (error) {
    console.error("❌ Cloudinary Upload Error for image:", String(image).substring(0, 50) + "...", error);
    // Re-throw with more context or a specific message
    throw new Error(`Image upload failed: ${error.message || error}`);
  }
};

export async function POST(req) {
  try {
    await connectdb();
    console.log("DEBUG: Database connected successfully.");

    // ✅ Authorization
    const user = await requireSignIn(req);
    if (!user) {
      console.error("❌ Authorization failed. User not found or token invalid.");
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    console.log("DEBUG: User authenticated:", user.id);

    // ✅ JSON Parsing with Error Handling
    let body;
    try {
      body = await req.json();
      console.log("DEBUG: Request body parsed successfully.");
      // Debugging: Log the entire incoming body (careful with very large payloads)
      // For production, avoid logging full base64 strings
      // console.log("DEBUG: Incoming Request Body:", JSON.stringify(body, null, 2));
    } catch (error) {
      console.error("❌ JSON Parsing Error: Request body might not be valid JSON.", error);
      return NextResponse.json({ success: false, message: "Invalid JSON format" }, { status: 400 });
    }

    // ✅ Extracting Fields and providing default empty values for safer destructuring
    const {
      name = '',
      productslug = '',
      price, // Keep as is, will validate later
      currency = '',
      minimumOrderQuantity, // Keep as is
      moqUnit = '',
      images = [],
      country = '',
      state = '',
      city = '',
      description = "",
      category = '',
      subCategory = '',
      stock = 0,
      tradeInformation = {},
      specifications = {},
      tradeShopping = {},
    } = body;

    console.log("DEBUG: Extracted fields for product creation.");
    console.log("DEBUG: Images array length:", images.length);
    // console.log("DEBUG: Images data structure example:", JSON.stringify(images[0])); // Check structure of first image if exists

    // ✅ Validate Required Fields
    if (!name || !minimumOrderQuantity || !Array.isArray(images) || images.length === 0) {
      console.error("❌ Missing required fields. Debug info:", { name, minimumOrderQuantity, imagesLength: images.length, isImagesArray: Array.isArray(images) });
      return NextResponse.json({ success: false, message: "Required fields (name, minimumOrderQuantity, images) are missing or invalid." }, { status: 400 });
    }

    if (images.length > 6) { // Changed from 5 to 6 based on frontend max
      console.error("❌ Too many images:", images.length);
      return NextResponse.json({ success: false, message: "You can upload up to 6 images only" }, { status: 400 });
    }

    // ✅ Process Trade Pricing (Fixed vs Slab)
    // Check if sellingPriceType is provided, as it's critical for pricing logic
    if (!tradeShopping.sellingPriceType) {
      console.error("❌ Missing sellingPriceType in tradeShopping.");
      return NextResponse.json({ success: false, message: "Selling price type is required." }, { status: 400 });
    }

    let fixedSellingPrice = null;
    let slabPricing = [];

    if (tradeShopping.sellingPriceType === "Fixed") {
      // Validate fixedSellingPrice more robustly
      const parsedPrice = Number(tradeShopping.fixedSellingPrice);
      if (isNaN(parsedPrice) || parsedPrice <= 0) { // Ensure it's a positive number
        console.error("❌ Invalid fixed selling price:", tradeShopping.fixedSellingPrice);
        return NextResponse.json({ success: false, message: "Fixed selling price is required and must be a positive number." }, { status: 400 });
      }
      fixedSellingPrice = parsedPrice;
      console.log("DEBUG: Selling price type is Fixed. Price:", fixedSellingPrice);

    } else if (tradeShopping.sellingPriceType === "Slab") { // Frontend sends "Slab", not "Slab Based"
      console.log("DEBUG: Selling price type is Slab.");
      if (!Array.isArray(tradeShopping.slabPricing) || tradeShopping.slabPricing.length === 0) {
        // Allow empty slabPricing if sellingPriceType is Slab but no slabs are provided (though typically not desired)
        console.warn("WARN: Slab pricing type selected but no slabPricing provided.");
        slabPricing = [];
      } else {
        let validationFailed = false;
        const processedSlabs = [];

        for (let i = 0; i < tradeShopping.slabPricing.length; i++) {
          const slab = tradeShopping.slabPricing[i];
          const minQ = Number(slab.minQuantity);
          const maxQ = Number(slab.maxQuantity);
          const priceSlab = Number(slab.price);

          if (isNaN(minQ) || isNaN(maxQ) || isNaN(priceSlab) || minQ < 0 || maxQ < 0 || priceSlab < 0) {
            console.error(`❌ Slab ${i + 1} has invalid numeric values:`, { minQ, maxQ, priceSlab });
            validationFailed = true;
            break;
          }
          if (minQ >= maxQ) {
            console.error(`❌ Slab ${i + 1}: Min quantity (${minQ}) must be less than max quantity (${maxQ}).`);
            validationFailed = true;
            break;
          }
          processedSlabs.push({ minQuantity: minQ, maxQuantity: maxQ, price: priceSlab });
        }

        if (validationFailed) {
          return NextResponse.json({ success: false, message: "Invalid slab pricing details provided." }, { status: 400 });
        }
        slabPricing = processedSlabs;
        console.log("DEBUG: Processed slab pricing:", slabPricing);
      }
    } else {
        console.error("❌ Unknown sellingPriceType:", tradeShopping.sellingPriceType);
        return NextResponse.json({ success: false, message: "Invalid selling price type." }, { status: 400 });
    }

    // ✅ Validate Category & SubCategory
    console.log("DEBUG: Validating category:", category);
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      console.error("❌ Invalid category ID provided:", category);
      return NextResponse.json({ success: false, message: "Invalid category ID" }, { status: 400 });
    }
    console.log("DEBUG: Category found:", categoryExists.name);

    let subCategoryExists = null;
    if (subCategory) {
      console.log("DEBUG: Validating subCategory:", subCategory);
      subCategoryExists = await SubCategory.findById(subCategory);
      if (!subCategoryExists) {
        console.error("❌ Invalid subCategory ID provided:", subCategory);
        return NextResponse.json({ success: false, message: "Invalid subCategory ID" }, { status: 400 });
      }
      console.log("DEBUG: SubCategory found:", subCategoryExists.name);
    } else {
      console.log("DEBUG: No subCategory provided.");
    }

    // Ensure images array contains valid strings (base64 or URL) for uploadToCloudinary
    // Frontend sends images as [{ url: 'data:image/jpeg;base64,...' }]
    const base64ImagesToUpload = images.map((img) => {
      if (typeof img === "object" && img.url && typeof img.url === "string") {
        return img.url; // Extract the data URL string
      }
      // This case should theoretically not happen if frontend sends correct format
      if (typeof img === "string") {
          console.warn("WARN: Image received as plain base64 string, expected object {url: string}. Attempting to use directly.");
          return img;
      }
      console.error("❌ Invalid Image Data in array. Expected { url: 'data:...' } or a base64 string. Received:", img);
      throw new Error("❌ Invalid Image Data: Each image must be a Base64 string or an object with a 'url' property.");
    });
    console.log("DEBUG: Extracted image URLs for Cloudinary upload. Count:", base64ImagesToUpload.length);

    // Filter out any potential empty or invalid image strings before upload to prevent Cloudinary errors
    const filteredImages = base64ImagesToUpload.filter(img => img && typeof img === 'string' && img.length > 50); // Minimum length check
    if (filteredImages.length !== base64ImagesToUpload.length) {
        console.warn("WARN: Some image entries were filtered out due to being empty or invalid strings.");
    }
    if (filteredImages.length === 0 && images.length > 0) {
        console.error("CRITICAL: No valid images found after filtering, but images array was not empty. Check image formatting from frontend.");
        return NextResponse.json({ success: false, message: "No valid images to upload. Ensure images are correctly formatted." }, { status: 400 });
    }

    let imageUrls = [];
    try {
      imageUrls = await Promise.all(filteredImages.map(uploadToCloudinary));
      console.log("DEBUG: All images uploaded to Cloudinary successfully.");
    } catch (uploadError) {
      console.error("❌ Critical: Failed to upload one or more images to Cloudinary.", uploadError);
      return NextResponse.json({ success: false, message: `Image upload failed: ${uploadError.message}` }, { status: 500 });
    }


    // ✅ Prepare data for Product model
    const productData = {
      userId: user.id,
      name,
      productslug,
      price: Number(price) || null, // Convert price to number, or null
      currency,
      minimumOrderQuantity: Number(minimumOrderQuantity) || null, // Convert MOQ to number, or null
      moqUnit,
      images: imageUrls.map(({ url, public_id }) => ({ url, public_id })),
      country,
      state,
      city,
      description,
      category: categoryExists._id,
      subCategory: subCategoryExists ? subCategoryExists._id : null,
      stock: Number(stock) || null, // Convert stock to number, or null
      tradeInformation: {
          ...tradeInformation,
          // Ensure mainExportMarkets is an array of strings, even if single string
          mainExportMarkets: Array.isArray(tradeInformation.mainExportMarkets)
            ? tradeInformation.mainExportMarkets
            : (typeof tradeInformation.mainExportMarkets === 'string' && tradeInformation.mainExportMarkets.length > 0
                ? tradeInformation.mainExportMarkets.split(',').map(m => m.trim()).filter(m => m !== '')
                : []),
          supplyAbility: tradeInformation.supplyAbility || '', // Default to empty string
          deliveryTime: tradeInformation.deliveryTime || '',
          fobPort: tradeInformation.fobPort || '',
          samplePolicy: tradeInformation.samplePolicy || '',
          sampleAvailable: tradeInformation.sampleAvailable || 'No', // Default
          certifications: tradeInformation.certifications || '',
          packagingDetails: tradeInformation.packagingDetails || '',
          paymentTerms: tradeInformation.paymentTerms || '',
          mainDomesticMarket: tradeInformation.mainDomesticMarket || '',
      },
      specifications: {
        ...specifications,
        // Convert 'Yes'/'No' to boolean for foldable
        foldable: specifications.foldable === "Yes",
        // Ensure numeric fields are correctly parsed, default to null if not provided or invalid
        thicknessTolerance: Number(specifications.thicknessTolerance) || null,
        width: Number(specifications.width) || null,
        length: Number(specifications.length) || null,
        weight: Number(specifications.weight) || null,
        widthTolerance: Number(specifications.widthTolerance) || null,
        thickness: Number(specifications.thickness) || null,
        // Ensure metalsType is an array of strings
        metalsType: Array.isArray(specifications.metalsType)
            ? specifications.metalsType
            : (typeof specifications.metalsType === 'string' && specifications.metalsType.length > 0
                ? specifications.metalsType.split(',').map(m => m.trim()).filter(m => m !== '')
                : []),
      },
      tradeShopping: {
        sellingPriceType: tradeShopping.sellingPriceType,
        gst: Number(tradeShopping.gst) || null,
        fixedSellingPrice: fixedSellingPrice, // Use the already processed fixedSellingPrice
        slabPricing, // Use the already processed slabPricing array
        unit: tradeShopping.unit || '',
        packSize: tradeShopping.packSize || '',
        minOrderedPacks: Number(tradeShopping.minOrderedPacks) || null,
        isReturnable: tradeShopping.isReturnable === "Yes" ? "Yes" : "No",
        stockQuantity: Number(tradeShopping.stockQuantity) || null,
        weightPerUnit: Number(tradeShopping.weightPerUnit) || null,
        weightUnit: tradeShopping.weightUnit || 'kg',
        shippingType: tradeShopping.shippingType || "Free",
        packageDimensions: {
          length: Number(tradeShopping.packageDimensions.length) || null,
          width: Number(tradeShopping.packageDimensions.width) || null,
          height: Number(tradeShopping.packageDimensions.height) || null,
          unit: tradeShopping.packageDimensions.unit || "cm",
        },
      },
    };

    console.log("DEBUG: Product data prepared for Mongoose. Data sample (excluding full images):", {
        name: productData.name,
        price: productData.price,
        imagesCount: productData.images.length,
        category: productData.category,
        fixedSellingPrice: productData.tradeShopping.fixedSellingPrice,
        slabPricingCount: productData.tradeShopping.slabPricing.length,
        // ... add other key fields you want to quickly verify
    });


    // ✅ Create & Save Product
    const newProduct = new Product(productData);
    await newProduct.save();
    console.log("DEBUG: Product saved to database with ID:", newProduct._id);

    // Update user's products array
    await User.findByIdAndUpdate(user.id, { $push: { products: newProduct._id } });
    console.log("DEBUG: User's product list updated.");

    return NextResponse.json({ success: true, message: "Product created successfully", data: newProduct }, { status: 201 });

  } catch (error) {
    console.error("❌ Final Catch Block: Error creating product. Details:", error);
    // Log error name and message for better debugging
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    // If it's a Mongoose validation error, log details
    if (error.name === 'ValidationError') {
        const errors = {};
        for (const field in error.errors) {
            errors[field] = error.errors[field].message;
            console.error(`Mongoose Validation Error: Field ${field} - ${error.errors[field].message}`);
        }
        return NextResponse.json({ success: false, message: "Validation failed", errors: errors }, { status: 400 });
    }
    // For other unexpected errors
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
      return NextResponse.json({ success: true, products: [] }, { status: 200 });
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

