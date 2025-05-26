import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  clientName: {
    type: String,
    trim: true,
  },
  clientEmail: {
    type: String,
    trim: true,
  },
  letterhead: {
    type: String,
  },
  footer: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
