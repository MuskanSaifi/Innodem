import Admin from "@/models/Admin";
import { generateToken } from "@/lib/auth";
import { NextResponse } from "next/server";
import connectdb from "@/lib/dbConnect";

export async function POST(req) {
  try {
    await connectdb();
    const { email, password } = await req.json();

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password)))
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = generateToken(admin._id);
    const response = NextResponse.json({ success: true, admin }, { status: 200 });
    response.cookies.set("adminToken", token, { httpOnly: true, secure: true });

    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
