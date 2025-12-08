import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";

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

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return Response.json(
      {
        success: true,
        products,
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
