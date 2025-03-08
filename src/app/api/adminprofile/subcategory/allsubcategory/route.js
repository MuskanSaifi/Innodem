import mongoose from "mongoose";
import connectDB from "@/lib/dbConnect";
import SubCategory from "@/models/SubCategory";

// ✅ GET API - Fetch all subcategories
export async function GET() {
  try {
    await connectDB();

    // Fetch all subcategories and populate category and products
    const subCategories = await SubCategory.find()
      .populate("category")
      .populate("products");

    return new Response(JSON.stringify(subCategories), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch subcategories." }),
      { status: 500 }
    );
  }
}

// ✅ DELETE API - Delete subcategory by ID
export async function DELETE(req) {
  try {
    await connectDB();
    
    // Extract subcategory ID from request query parameters
    const url = new URL(req.url);
    const subCategoryId = url.searchParams.get("id");

    // Validate subcategory ID
    if (!subCategoryId || !mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return new Response(
        JSON.stringify({ error: "Invalid subcategory ID." }),
        { status: 400 }
      );
    }

    // Check if subcategory exists
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory) {
      return new Response(
        JSON.stringify({ error: "Subcategory not found." }),
        { status: 404 }
      );
    }

    // Delete subcategory
    await SubCategory.findByIdAndDelete(subCategoryId);

    return new Response(
      JSON.stringify({ message: "Subcategory deleted successfully." }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete subcategory." }),
      { status: 500 }
    );
  }
}
