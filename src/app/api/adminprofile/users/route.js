
import User from "@/models/User";
import Product from "@/models/Product";
import connectdb from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import SupportPerson from "@/models/SupportPerson"; // ✅ Make sure this line is present
import Category from "@/models/Category"; // ✅ REQUIRED for .populate("category") to work
import SubCategory from "@/models/SubCategory";


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
    await connectdb();
    const users = await User.find()
      .populate([
        {
          path: "products",
          populate: [
            { path: "category", select: "name" },
            { path: "subCategory", select: "name" },
          ],
        },
        {
          path: "supportPerson", // ✅ This adds support person info
          select: "name email number", // ✅ Only include needed fields
        }
      ])
      .lean();

    // Optional: further enrich product fields
    for (const user of users) {
      for (const product of user.products || []) {
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
      totalUsers: users.length,
    }, { status: 200 });

  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json({
      success: false,
      totalUsers: 0,
      message: `Internal Server Error: ${error.message}`,
    }, { status: 500 });
  }
}


export async function PATCH(req) {
  await connectdb();

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("id");

  if (!userId) {
    return NextResponse.json({ message: "User ID is required" }, { status: 400 });
  }

  const body = await req.json();
  const { remark } = body;

  if (!remark) {
    return NextResponse.json({ message: "Remark is required" }, { status: 400 });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { remark },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Remark updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error updating remark", error }, { status: 500 });
  }
}




