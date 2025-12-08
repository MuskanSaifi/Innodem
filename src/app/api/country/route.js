import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";

export async function GET(req) {
  await connectdb();
  
  try {
    const { searchParams } = new URL(req.url);
    const country = searchParams.get("country");

    const filter = {};

    if (country) {
      const cleanCountry = country.replace(/-/g, " ");
      filter.country = { $regex: new RegExp(cleanCountry, "i") };
    }

    // Fetch products of this country
    const products = await Product.find(filter)
      .populate("category")
      .populate("subCategory");

    // Unique categories
    const categories = [];
    const subcategories = [];

    products.forEach((p) => {
      if (p.category && !categories.some(c => c._id == p.category._id)) {
        categories.push(p.category);
      }
      if (p.subCategory && !subcategories.some(s => s._id == p.subCategory._id)) {
        subcategories.push(p.subCategory);
      }
    });

    return Response.json(
      {
        success: true,
        categories,
        subcategories,
      },
      { status: 200 }
    );

  } catch (error) {
    console.log("API ERROR:", error);
    return Response.json(
      {
        success: false,
        message: "Server error",
      },
      { status: 500 }
    );
  }
}
