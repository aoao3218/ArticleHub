import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const teamSchema = new Schema({
  id: Types.ObjectId,
  name: String,
  owner: {
    type: Types.ObjectId,
    ref: 'users',
  },
  member: [
    {
      id: { type: Types.ObjectId, ref: 'users' },
      role: { type: String, enum: ['admin', 'user'], default: 'user' },
    },
  ],
});

export default mongoose.model('teams', teamSchema);
