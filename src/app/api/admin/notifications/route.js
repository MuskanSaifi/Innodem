import { NextResponse } from 'next/server';
import connectdb from '@/lib/dbConnect';
import Notification from '@/models/Notification';

export async function POST(req) {
  await connectdb();

  const body = await req.json();
  const { title, message } = body;

  if (!title || !message) {
    return NextResponse.json({ success: false, error: 'Title and message required' }, { status: 400 });
  }

  try {
    const notification = await Notification.create({ title, message });

    // You can trigger push notification here if using FCM or OneSignal.

    return NextResponse.json({ success: true, data: notification }, { status: 201 });
  } catch (error) {
    console.error('POST /notifications error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}



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