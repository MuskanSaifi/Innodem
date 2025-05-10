import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, message: "Logged out" });
  response.cookies.set("supportToken", "", {
    httpOnly: true,
    expires: new Date(0), // expires the cookie
    path: "/",
  });
  return response;
}
