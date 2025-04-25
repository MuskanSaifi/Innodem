import { NextResponse } from "next/server";
import ClientWebsiteData from "@/models/Clientwebsitedata";
import connectdb from "@/lib/dbConnect";

export async function POST(request) {
  try {
    await connectdb();

    const body = await request.json();
    if (!body.websitename) {
      return NextResponse.json({ error: "websitename is required" }, { status: 400 });
    }

    const clientdata = new ClientWebsiteData(body);
    await clientdata.save();

    return NextResponse.json({ message: "Your message has been sent successfully!" }, { status: 201 });
  } catch (error) {
    console.error("Error saving clientdata:", error);

    const errorMessage = error.name === "ValidationError" 
      ? { error: "Validation failed", messages: Object.values(error.errors).map((err) => err.message) } 
      : { error: "Failed to save clientdata. Please try again later." };

    return NextResponse.json(errorMessage, { status: error.name === "ValidationError" ? 400 : 500 });
  }
}
