
import User from "@/models/User";
import Product from "@/models/Product";
import connectdb from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  try {
    await connectdb(); // ✅ Ensure DB connection

    // ✅ Extract userId from request
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    // ✅ Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // ✅ Delete all products of this user
    await Product.deleteMany({ userId });

    // ✅ Delete the user
    await User.findByIdAndDelete(userId);

    return NextResponse.json({ success: true, message: "User and their products deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("❌ Error deleting user:", error);
    return NextResponse.json({ success: false, message: `Internal Server Error: ${error.message}` }, { status: 500 });
  }
}


export async function GET() {
  try {
    await connectdb(); // ✅ Ensure DB connection

    // ✅ Fetch all users with their associated products
    const users = await User.find()
      .populate({
        path: "products",
        populate: [
          { path: "category", select: "name" },
          { path: "subCategory", select: "name" }
        ],
      })
      .lean();

    // ✅ Fetch additional product details separately
    for (const user of users) {
      for (const product of user.products) {
        const fullProduct = await Product.findById(product._id)
          .select("name price currency tradeInformation specifications tradeShopping")
          .lean();
        Object.assign(product, fullProduct);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Users retrieved successfully",
      users,
      totalUsers: users.length, // ✅ Add total users count
    }, { status: 200 });


  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({
       success: false, 
       totalUsers: 0,
       message: `Internal Server Error: ${error.message}` },
       { status: 500 });
  }
}




