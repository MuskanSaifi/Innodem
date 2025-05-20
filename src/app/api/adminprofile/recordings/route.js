import { NextResponse } from 'next/server';
import connectdb from "@/lib/dbConnect";
import SupportPerson from '@/models/SupportPerson';



export async function GET() {
  try {
    await connectdb();

    const supportPeople = await SupportPerson.find(); 

    return NextResponse.json({ success: true, data: supportPeople });
  } catch (error) {
    console.error('Error fetching support people:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch support people' }, { status: 500 });
  }
}