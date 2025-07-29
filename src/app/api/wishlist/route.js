// app/api/wishlist/route.js

import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import connectdb from "@/lib/dbConnect";
import Product from "@/models/Product";
import User from "@/models/User";

// Helper function to get user ID from the request using your CUSTOM JWT
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

// GET /api/wishlist - Fetch user's wishlist
export async function GET(req) {
    await connectdb();
    try {
        const userId = await getUserIdFromRequest(req);
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const user = await User.findById(userId).populate("wishlist");
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ wishlist: user.wishlist }, { status: 200 });
    } catch (error) {
        console.error("Error fetching wishlist:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

// POST /api/wishlist - Add a product to wishlist
export async function POST(req) {
    await connectdb();
    try {
        const userId = await getUserIdFromRequest(req);
        const { productId } = await req.json();

        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        if (!productId) {
            return NextResponse.json({ message: "Product ID is required" }, { status: 400 });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        const user = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { wishlist: productId } },
            { new: true }
        ).populate("wishlist");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Product added to wishlist", wishlist: user.wishlist }, { status: 200 });
    } catch (error) {
        console.error("Error adding product to wishlist:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}

