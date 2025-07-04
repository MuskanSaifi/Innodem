// app/api/enquiry/create/route.js

// Comment out all other imports for now
// import connectdb from "@/lib/dbConnect";
// import purchaseRequestSchema from "@/models/purchaseRequestSchema";
// import PushToken from "@/models/PushToken";
import { NextResponse } from 'next/server';
// import Expo from 'expo-server-sdk';
// let expo = new Expo();

export async function POST(request) {
  // Return a simple success response immediately, without any logic
  return NextResponse.json({ success: true, message: "Route reached (test)" }, { status: 200 });
}