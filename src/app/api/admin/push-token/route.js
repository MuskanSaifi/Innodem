// pages/api/admin/push-token.js

import { NextResponse } from 'next/server';
import connectdb from '@/lib/dbConnect';
import User from '@/models/User'; // Assuming you have a User model

export async function POST(req) {
  await connectdb();

  const { token, userId } = await req.json();

  if (!token || !userId) {
    return NextResponse.json({ success: false, error: 'Token and User ID are required' }, { status: 400 });
  }

  try {
    // Find the user and update their push token
    const user = await User.findByIdAndUpdate(userId, { pushToken: token }, { new: true });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Push token saved successfully' });
  } catch (error) {
    console.error('POST /push-token error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}