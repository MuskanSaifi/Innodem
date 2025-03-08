// API Functions
import mongoose from "mongoose";
import connectDB from "@/lib/dbConnect";
import SubCategory from "@/models/SubCategory";  // Import SubCategory model
import Product from "@/models/Product";          // Import Product model
import Category from "@/models/Category";        // Import Category model


// PATCH method - Update a subcategory
export async function PATCH(req) {
  try {
    await connectDB(); // Ensure database connection
    const body = await req.json();
    const { id, name, category, products } = body;

    // Validate if ID is provided and is a valid MongoDB ObjectId
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid subcategory ID." }), {
        status: 400,
      });
    }

    // Check if subcategory exists
    const subCategory = await SubCategory.findById(id);
    if (!subCategory) {
      return new Response(
        JSON.stringify({ error: "Subcategory not found." }),
        { status: 404 }
      );
    }

    // Validate category ID if provided
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      return new Response(JSON.stringify({ error: "Invalid category ID." }), {
        status: 400,
      });
    }
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return new Response(
          JSON.stringify({ error: "Category not found." }),
          { status: 404 }
        );
      }
    }

    // Validate product IDs if provided
    if (products && products.length > 0) {
      const invalidProducts = [];
      for (const productId of products) {
        if (!mongoose.Types.ObjectId.isValid(productId)) {
          invalidProducts.push(productId);
          continue;
        }
        const productExists = await Product.findById(productId);
        if (!productExists) {
          invalidProducts.push(productId);
        }
      }
      if (invalidProducts.length > 0) {
        return new Response(
          JSON.stringify({ error: `Invalid product IDs: ${invalidProducts.join(", ")}` }),
          { status: 400 }
        );
      }
    }

    // Update subcategory fields if provided
    if (name) subCategory.name = name.trim();
    if (category) subCategory.category = category;
    if (products) subCategory.products = products;

    // Save the updated subcategory
    const updatedSubCategory = await subCategory.save();

    // Populate category and products fields
    const populatedSubCategory = await SubCategory.findById(updatedSubCategory._id)
      .populate("category")
      .populate("products");

    return new Response(JSON.stringify(populatedSubCategory), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to update subcategory." }),
      { status: 500 }
    );
  }
}

// POST method - Create a new subcategory
export async function POST(req) {
  try {
    const body = await req.json();

    // Required fields validation
    const requiredFields = ["name", "category"];
    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(
          JSON.stringify({ error: `Missing required field: ${field}` }),
          { status: 400 }
        );
      }
    }

    // Validate that the provided category ID is valid
    const categoryExists = await Category.findById(body.category);
    if (!categoryExists) {
      return new Response(
        JSON.stringify({ error: `Invalid category ID: ${body.category}` }),
        { status: 400 }
      );
    }

    // Validate that the provided product IDs are valid
    if (body.products && body.products.length > 0) {
      const invalidProducts = [];
      for (const productId of body.products) {
        const productExists = await Product.findById(productId);
        if (!productExists) {
          invalidProducts.push(productId);
        }
      }
      if (invalidProducts.length > 0) {
        return new Response(
          JSON.stringify({ error: `Invalid product IDs: ${invalidProducts.join(", ")}` }),
          { status: 400 }
        );
      }
    }

    // Connect to DB
    await connectDB();

    // Check if a subcategory with the same name already exists in the same category
    const existingSubCategory = await SubCategory.findOne({
      name: body.name.trim(),
      category: body.category,
    });

    if (existingSubCategory) {
      return new Response(
        JSON.stringify({ error: `Subcategory with name "${body.name}" already exists in this category.` }),
        { status: 400 }
      );
    }

    // Create and save the new subcategory
    const newSubCategory = new SubCategory({
      name: body.name.trim(),
      category: body.category,  // Reference to Category ID
      products: body.products,  // Array of product IDs
    });

    const savedSubCategory = await newSubCategory.save();

    // Populate the category and products fields
    const populatedSubCategory = await SubCategory.findById(savedSubCategory._id)
      .populate("category")
      .populate("products");

    return new Response(JSON.stringify(populatedSubCategory), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error saving subcategory:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to save subcategory" }),
      { status: 500 }
    );
  }
}

// GET method - Fetch subcategories based on category or all subcategories
export async function GET(req) {
  try {
    // Extract categoryId from query parameters (if available)
    const categoryId = req.url?.split('?')[1]?.split('=')[1]; // Get the query parameter from URL
    
    // Connect to the database
    await connectDB();

    let subCategories;

    if (categoryId) {
      // Fetch subcategories by category ID
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return new Response(
          JSON.stringify({ error: `Category with ID ${categoryId} not found` }),
          { status: 404 }
        );
      }

      subCategories = await SubCategory.find({ category: categoryId }).populate("category").populate("products");
    } else {
      // Fetch all subcategories if no categoryId is provided
      subCategories = await SubCategory.find().populate("category").populate("products");
    }

    // Return the subcategories as a JSON response
    return new Response(
      JSON.stringify(subCategories),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to fetch subcategories" }),
      { status: 500 }
    );
  }
}   




