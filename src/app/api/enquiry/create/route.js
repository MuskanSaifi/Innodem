// app/api/enquiry/create/route.js

import connectdb from "@/lib/dbConnect";
import purchaseRequestSchema from "@/models/purchaseRequestSchema"; // Your enquiry model
import PushToken from "@/models/PushToken"; // Your new PushToken model
import { NextResponse } from 'next/server'; // Import NextResponse for App Router responses
import Expo from 'expo-server-sdk'; // Import the Expo Server SDK

// Initialize Expo SDK client outside the handler to avoid re-initialization
let expo = new Expo(); // This is the line where `new Expo()` is used

export async function POST(request) {
    try {
        await connectdb();

        const body = await request.json();
        const { buyerId, sellerId, productId, quantity, unit, message } = body;

        if (!buyerId || !sellerId || !productId || !quantity) {
            return NextResponse.json(
                { success: false, message: "Missing required fields for enquiry" },
                { status: 400 }
            );
        }

        const newEnquiry = await purchaseRequestSchema.create({
            buyer: buyerId,
            seller: sellerId,
            product: productId,
            quantity: quantity,
            unit: unit,
            message: message,
            status: 'Pending',
        });

        console.log(`New enquiry created: ${newEnquiry._id}`);

        const sellerPushTokenDoc = await PushToken.findOne({ userId: sellerId });

        if (sellerPushTokenDoc && Expo.isExpoPushToken(sellerPushTokenDoc.token)) {
            const messages = [];
            messages.push({
                to: sellerPushTokenDoc.token,
                sound: 'default',
                title: '🎉 New Enquiry Received!',
                body: `You have a new enquiry for ${quantity} ${unit || ''} of Product ID: ${productId}.`,
                data: {
                    enquiryId: newEnquiry._id.toString(),
                    buyerId: buyerId.toString(),
                    productId: productId.toString(),
                    type: 'new_enquiry'
                },
            });

            let chunks = expo.chunkPushNotifications(messages);
            let tickets = [];

            for (let chunk of chunks) {
                try {
                    let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                    console.log('Push notification tickets:', ticketChunk);
                    tickets.push(...ticketChunk);
                } catch (error) {
                    console.error('Error sending push notification chunk:', error);
                    if (error.details) {
                        console.error('Expo error details:', error.details);
                    }
                }
            }
        } else {
            console.warn(`Seller ${sellerId} does not have a valid Expo Push Token registered. Notification skipped.`);
        }

        return NextResponse.json({ success: true, message: "Enquiry created successfully", data: newEnquiry }, { status: 201 });

    } catch (error) {
        console.error("Error creating enquiry:", error);
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}