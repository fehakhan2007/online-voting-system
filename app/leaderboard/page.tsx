'use client';

import { useState, useEffect } from 'react';
import { Trophy, Vote, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';

export default function Leaderboard() {
  const [candidates, setCandidates] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      setError('');
      const candidatesRes = await fetch('/api/candidates');
      
      if (!candidatesRes.ok) {
        throw new Error('Failed to fetch candidates');
      }
      
      const candidatesData = await candidatesRes.json();
      
      if (candidatesData.error) {
        throw new Error(candidatesData.error);
      }

      // Calculate total votes from candidates instead of separate API call
      const totalVotesCount = candidatesData.reduce((sum: number, candidate: any) => sum + (candidate.votes || 0), 0);
      
      setCandidates(candidatesData.sort((a: any, b: any) => b.votes - a.votes));
      setTotalVotes(totalVotesCount);
      setLoading(false);
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-800">Leaderboard</h1>
          </div>
          <Link href="/" className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <Vote className="w-5 h-5" />
            <span>Vote Now</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Election Results</h2>
          <div className="flex justify-center items-center space-x-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>{totalVotes} Total Votes</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5" />
              <span>Live Results</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {candidates.map((candidate: any, index) => {
            const percentage = totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0;
            
            return (
              <div key={candidate._id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      index === 0 ? 'bg-yellow-400 text-yellow-900' :
                      index === 1 ? 'bg-gray-300 text-gray-700' :
                      index === 2 ? 'bg-orange-400 text-orange-900' :
                      'bg-gray-200 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{candidate.name}</h3>
                      <p className="text-sm text-gray-500">{candidate.position}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-purple-600">{candidate.votes}</div>
                    <div className="text-sm text-gray-500">votes</div>
                  </div>
                </div>
                <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-right mt-2 text-sm font-semibold text-gray-600">{percentage}%</div>
              </div>
            );
          })}
        </div>

        {totalVotes === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No votes cast yet. Be the first to vote!</p>
          </div>
        )}
      </div>
    </div>
  );
}