import connectDB from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

// POST method - Create a new product
export async function POST(req) {
  try {
    const body = await req.json();

    // Required fields validation
    const requiredFields = ["name", "description", "price", "category", "brand", "countInStock"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400 }
        );
      }
    }

    // Additional field validations
    if (body.price < 0) throw new Error("Price must be a positive number");
    if (body.rating && (body.rating < 0 || body.rating > 5)) throw new Error("Rating must be between 0 and 5");
    if (body.images && body.images.length > 5) throw new Error("You can upload a maximum of 5 images");

    // Validate image URLs (optional, for better consistency)
    if (body.images) {
      for (let img of body.images) {
        if (typeof img !== "string" || !img.startsWith("http")) {
          throw new Error("Invalid image URL");
        }
      }
    }

    await connectDB();

    // Validate category existence
    const categoryExists = await Category.findById(body.category);
    if (!categoryExists) throw new Error("Invalid category ID");

    // Validate subCategory existence (if provided)
    if (body.subCategory) {
      const subCategoryExists = await SubCategory.findById(body.subCategory);
      if (!subCategoryExists) throw new Error("Invalid subCategory ID");
    }

    // Create and save the new product
    const newProduct = new Product({
      name: body.name.trim(),
      description: body.description.trim(),
      price: body.price,
      images: body.images || [],
      category: body.category,
      subCategory: body.subCategory || null,
      available: body.available ?? true,
      quantity: body.quantity ?? 0,
      brand: body.brand.trim(),
      countInStock: body.countInStock,
      rating: body.rating || 0,
      numReviews: body.numReviews || 0,
      tags: body.tags || [],
      featured: body.featured || false,
      discount: body.discount || 0,
      sku: body.sku || null,
    });

    const savedProduct = await newProduct.save();

    return new Response(JSON.stringify(savedProduct), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving product:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to save product" }),
      { status: 500 }
    );
  }
}
// GET method - Fetch all products
export async function GET(req) {
  try {
    await connectDB();
    const products = await Product.find({});

    return new Response(JSON.stringify(products), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch products", details: error.message }),
      { status: 500 }
    );
  }
}
