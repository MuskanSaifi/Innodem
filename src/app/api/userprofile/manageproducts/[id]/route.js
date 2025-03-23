import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";
import { requireSignIn } from "@/middlewares/requireSignIn";
import Product from "@/models/Product";


export async function DELETE(req, context) {
  try {
    await connectdb();

    // Authenticate user
    // const user = await requireSignIn(req);
    // if (!user) {
    //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    // }

    // ✅ Await params correctly
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    // Find the product by ID
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Ensure the user owns the product
    // if (product.userId.toString() !== user.id) {
    //   return NextResponse.json({ success: false, message: "Unauthorized to delete this product" }, { status: 403 });
    // }

    // Delete the product
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}


export async function PATCH(req) {
  try {
    await connectdb();

    // ✅ Authenticate User
    const user = await requireSignIn(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Parse Request Body
    const body = await req.json();
    if (!body.productId) {
      return NextResponse.json({ success: false, message: "Product ID is required" }, { status: 400 });
    }

    // ✅ Ensure only allowed fields are updated
    const allowedFields = [
      "name", "price", "currency", "minimumOrderQuantity", "moqUnit", "stock",
      "state", "city", "description", "specifications", "tradeShopping"
    ];
    
    const updateFields = {};
    Object.keys(body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updateFields[key] = body[key];
      }
    });
    

    // ✅ Find and Update Product
    const product = await Product.findOneAndUpdate(
      { _id: body.productId, userId: user.id },
      { $set: updateFields },
      { new: true }
    );

    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product updated successfully", data: product }, { status: 200 });

  } catch (error) {
    console.error("❌ Error updating product:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
