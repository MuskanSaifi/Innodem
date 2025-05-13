import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Buyer from '@/models/Buyer'; // adjust this path as needed
import connectdb from '@/lib/dbConnect';

export async function POST(request) {
  try {
    await connectdb();
    const body = await request.json();

    const {
      fullname,
      email,
      mobileNumber,
      countryCode,
      productname,
      quantity,
      unit,
      orderValue,
      currency,
    } = body;
// Validate required fields individually
if (!mobileNumber) {
  return NextResponse.json({ error: 'Mobile number is required' }, { status: 400 });
}

if (!countryCode) {
  return NextResponse.json({ error: 'Country code is required' }, { status: 400 });
}

if (!productname) {
  return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
}

    // Check for existing buyer with same mobileNumber
    let existingBuyer = await Buyer.findOne({ mobileNumber });
    if (existingBuyer) {
      return NextResponse.json({ message: 'Buyer already exists', buyer: existingBuyer }, { status: 200 });
    }

    // Create new buyer
    const newBuyer = new Buyer({
      fullname,
      email,
      mobileNumber,
      countryCode,
      productname,
      quantity,
      unit,
      orderValue,
      currency,
    });

    await newBuyer.save();

    return NextResponse.json({ message: 'Buyer saved successfully', buyer: newBuyer }, { status: 201 });

  } catch (error) {
    console.error('Error saving buyer:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
