import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema({
  voterName: { type: String, required: true, unique: true },
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: 'Candidate', required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Vote || mongoose.model('Vote', VoteSchema);