// app/api/admin/notifications/route.js (Next.js App Router)

import { NextResponse } from 'next/server';
import connectdb from '@/lib/dbConnect';
import Notification from '@/models/Notification';
import User from '@/models/User'; // Assuming you have a User model
import { Expo } from 'expo-server-sdk';

export async function POST(req) {
  await connectdb();

  const body = await req.json();
  const { title, message } = body;

  if (!title || !message) {
    return NextResponse.json({ success: false, error: 'Title and message required' }, { status: 400 });
  }

  try {
    const notification = await Notification.create({ title, message });

    // --- PUSH NOTIFICATION LOGIC ---
    let expo = new Expo();
    let messages = [];

    // 1. Fetch all users with a push token
    const usersWithTokens = await User.find({ pushToken: { $exists: true, $ne: null } });

    // 2. Create a notification message for each valid token
    for (let user of usersWithTokens) {
      if (!Expo.isExpoPushToken(user.pushToken)) {
        console.error(`Push token ${user.pushToken} is not a valid Expo push token`);
        continue;
      }
      messages.push({
        to: user.pushToken,
        sound: 'default',
        title: title,
        body: message,
        data: {
          screen: 'NotificationsScreen', // This data will be used for deep linking
          notificationId: notification._id, // Pass the new notification's ID
        },
      });
    }

    // 3. Send the notifications in chunks
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('Error sending push notification chunk:', error);
        }
      }
    })();
    // -------------------------------

    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error) {
    console.error('POST /notifications error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

// ... GET handler remains the same


export async function GET() {
  await connectdb();

  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: notifications });
  } catch (error) {
    console.error('GET /notifications error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}