import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Candidate from '@/models/Candidate';

export async function GET() {
  try {
    await dbConnect();
    const candidates = await Candidate.find({}).sort({ votes: -1 });
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

export async function POST() {
  try {
    await dbConnect();
    
    const existingCandidates = await Candidate.countDocuments();
    if (existingCandidates === 0) {
      const defaultCandidates = [
        { name: 'Feha Khan', position: 'President', description: 'Visionary leader committed to innovation', votes: 0 },
        { name: 'Vanshika Sharma', position: 'Vice President', description: 'Dedicated to student empowerment', votes: 0 },
        { name: 'Yashika Khan', position: 'Secretary', description: 'Passionate about transparency and communication', votes: 0 },
        { name: 'Samreen Ali', position: 'Treasurer', description: 'Expert in financial management and planning', votes: 0 },
        { name: 'Tamanna Pathan', position: 'Cultural Head', description: 'Enthusiastic about diversity and inclusion', votes: 0 }
      ];
      await Candidate.insertMany(defaultCandidates);
    }
    
    const candidates = await Candidate.find({});
    return NextResponse.json(candidates);
  } catch (error) {
    console.error('Error initializing candidates:', error);
    return NextResponse.json({ error: 'Failed to initialize candidates' }, { status: 500 });
  }
}