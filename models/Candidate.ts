import mongoose from 'mongoose';

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  position: { type: String, required: true },
  description: { type: String, required: true },
  votes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Candidate || mongoose.model('Candidate', CandidateSchema);