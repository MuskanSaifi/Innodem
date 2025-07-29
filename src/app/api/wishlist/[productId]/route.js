// app/api/wishlist/[productId]/route.js

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectdb from "@/lib/dbConnect";
import User from "@/models/User";

// Helper function (can be extracted to a common utility if many routes need it)
const getUserIdFromRequest = async (req) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn("Unauthorized access attempt: No Bearer token in header.");
        return null;
    }
    const tokenString = authHeader.split(" ")[1];
    const decodedToken = verifyToken(tokenString);
    if (!decodedToken || !decodedToken.id) {
        console.warn("Unauthorized access attempt: Invalid or malformed token payload (missing 'id'). Token:", tokenString);
        return null;
    }
    return decodedToken.id;
};

// DELETE /api/wishlist/[productId] - Remove a product from wishlist
// Next.js App Router passes dynamic segments as a `params` object in the request object.
export async function DELETE(req, { params }) { // Destructure params from the second argument
    await connectdb();
    try {
        const userId = await getUserIdFromRequest(req);
        // FIX: Await params here
        const { productId } = await params; // Await the params object

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { wishlist: productId } },
            { new: true }
        ).populate("wishlist");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product removed from wishlist", wishlist: user.wishlist }, { status: 200 });
    } catch (error) {
        console.error("Error removing product from wishlist:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}