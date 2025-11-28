'use client';

import { useState, useEffect } from 'react';
import { Vote, Trophy } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [voterName, setVoterName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    try {
      const res = await fetch('/api/candidates');
      if (!res.ok) {
        throw new Error('Failed to fetch');
      }
      const data = await res.json();
      if (data.length === 0) {
        await fetch('/api/candidates', { method: 'POST' });
        const newRes = await fetch('/api/candidates');
        const newData = await newRes.json();
        setCandidates(newData);
      } else {
        setCandidates(data);
      }
    } catch (err) {
      console.error('Error loading candidates:', err);
      setMessage('Error loading candidates. Please refresh the page.');
    }
  };

  const handleVote = async () => {
    if (!selectedCandidate || !voterName.trim()) {
      setMessage('Please select a candidate and enter your name');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterName, candidateId: selectedCandidate })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Vote submitted successfully!');
        setSelectedCandidate('');
        setVoterName('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Error submitting vote');
      }
    } catch (err) {
      setMessage('Error submitting vote. Please try again.');
      console.error('Vote error:', err);
    } finally {
      setLoading(false);
    }
  };

  const groupedCandidates = candidates.reduce((acc: any, candidate: any) => {
    if (!acc[candidate.position]) {
      acc[candidate.position] = [];
    }
    acc[candidate.position].push(candidate);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Vote className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">VoteNow</h1>
          </div>
          <Link href="/leaderboard" className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            <Trophy className="w-5 h-5" />
            <span>Leaderboard</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Cast Your Vote</h2>
          <p className="text-lg text-gray-600">Choose your preferred candidate for the upcoming election</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
            <input
              type="text"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          {Object.keys(groupedCandidates).map((position) => (
            <div key={position} className="mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">{position}</h3>
              <div className="space-y-3">
                {groupedCandidates[position].map((candidate: any) => (
                  <label
                    key={candidate._id}
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedCandidate === candidate._id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="candidate"
                      value={candidate._id}
                      checked={selectedCandidate === candidate._id}
                      onChange={(e) => setSelectedCandidate(e.target.value)}
                      className="mt-1 mr-3"
                    />
                    <div>
                      <div className="font-semibold text-gray-800">{candidate.name}</div>
                      <div className="text-sm text-gray-600">{candidate.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleVote}
            disabled={loading}
            className="w-full py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Vote'}
          </button>
        </div>
      </div>
    </div>
  );
}