import connectDB from "@/lib/dbConnect";
import Product from "@/models/Product";

export async function GET(req) {
  try {
    await connectDB();

    const products = await Product.find()
      .populate("userId", "name email") // Fetch user details (optional)
      .populate("category", "name") // Fetch category name
      .populate("subCategory", "name") // Fetch sub-category name
      .lean();

    return Response.json({ success: true, products }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return Response.json({ success: false, message: "Failed to fetch products" }, { status: 500 });
  }
}
