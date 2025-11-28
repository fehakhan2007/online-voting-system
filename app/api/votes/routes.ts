import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vote from '@/models/Vote';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    await dbConnect();
    const totalVotes = await Vote.countDocuments();
    return NextResponse.json({ totalVotes });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ totalVotes: 0 });
  }
}