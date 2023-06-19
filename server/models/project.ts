import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const projectSchema = new Schema({
  id: Types.ObjectId,
  name: String,
  team_id: {
    type: Types.ObjectId,
    ref: 'teams',
  },
  main: {
    type: String,
    default: 'main',
  },
  branch: [
    {
      name: String,
      createBy: { type: Types.ObjectId, ref: 'users' },
      merge_request: { type: Boolean, default: false },
    },
  ],
});
export default mongoose.model('projects', projectSchema);
