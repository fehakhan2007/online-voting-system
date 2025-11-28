import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/models/Candidate';
import Vote from '@/models/Vote';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { voterName, candidateId } = await request.json();

    if (!voterName || !candidateId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existingVote = await Vote.findOne({ voterName: voterName.toLowerCase().trim() });
    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted' }, { status: 400 });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 });
    }

    await Vote.create({ voterName: voterName.toLowerCase().trim(), candidateId });
    await Candidate.findByIdAndUpdate(candidateId, { $inc: { votes: 1 } });

    return NextResponse.json({ message: 'Vote submitted successfully' });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json({ error: 'Failed to submit vote' }, { status: 500 });
  }
}