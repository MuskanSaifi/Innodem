// app/api/enquiry/create/route.js

import connectdb from "@/lib/dbConnect";
import purchaseRequestSchema from "@/models/purchaseRequestSchema"; // Your enquiry model
import PushToken from "@/models/PushToken"; // Your new PushToken model
import { NextResponse } from 'next/server'; // Import NextResponse for App Router responses
import Expo from 'expo-server-sdk'; // Import the Expo Server SDK

// Initialize Expo SDK client outside the handler to avoid re-initialization
let expo = new Expo();

export async function POST(request) {
  try {
    await connectdb();

    const body = await request.json();
    const { buyerId, sellerId, productId, quantity, unit, message } = body; // Add 'message' for the enquiry text

    // Basic validation
    if (!buyerId || !sellerId || !productId || !quantity) {
      return NextResponse.json(
        { success: false, message: "Missing required fields for enquiry" },
        { status: 400 }
      );
    }

    // 1. Create the new enquiry (purchase request)
    const newEnquiry = await purchaseRequestSchema.create({
      buyer: buyerId,
      seller: sellerId,
      product: productId, // Assuming productId is a valid Product ObjectId
      quantity: quantity,
      unit: unit,
      message: message, // Store the buyer's message
      status: 'Pending', // Initial status
      // You might also want to store enquiryDate, etc.
    });

    console.log(`New enquiry created: ${newEnquiry._id}`);

    // 2. Find the seller's push token
    const sellerPushTokenDoc = await PushToken.findOne({ userId: sellerId });

    if (sellerPushTokenDoc && Expo.isExpoPushToken(sellerPushTokenDoc.token)) {
      // 3. Prepare and send the notification
      const messages = [];
      messages.push({
        to: sellerPushTokenDoc.token,
        sound: 'default', // Plays default notification sound
        title: '🎉 New Enquiry Received!',
        body: `You have a new enquiry for ${quantity} ${unit || ''} of Product ID: ${productId}.`,
        // You can fetch product and buyer names here for a more descriptive message if needed
        data: {
          enquiryId: newEnquiry._id.toString(), // Send enquiry ID for deep linking
          buyerId: buyerId.toString(),
          productId: productId.toString(),
          type: 'new_enquiry' // Useful for client-side handling
        },
      });

      let chunks = expo.chunkPushNotifications(messages);
      let tickets = []; // Store response tickets

      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log('Push notification tickets:', ticketChunk);
          tickets.push(...ticketChunk);
          // Optional: Handle individual ticket errors here if a specific notification failed
        } catch (error) {
          console.error('Error sending push notification chunk:', error);
          // Log specific error details from Expo
          if (error.details) {
            console.error('Expo error details:', error.details);
          }
        }
      }
      // Optional: You might want to save tickets for later receipt checking (Advanced)
    } else {
      console.warn(`Seller ${sellerId} does not have a valid Expo Push Token registered. Notification skipped.`);
    }

    return NextResponse.json({ success: true, message: "Enquiry created successfully", data: newEnquiry }, { status: 201 }); // 201 Created

  } catch (error) {
    console.error("Error creating enquiry:", error);
    return NextResponse.json(
      { success: false, message: "Server error during enquiry creation" },
      { status: 500 }
    );
  }
}