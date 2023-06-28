import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

interface Project {
  id: string;
  name: string;
  team_id: string;
  main: string;
  createBy: string;
  branch: Branch[];
}

interface Branch {
  name: string;
  createBy: string;
  merge_request: boolean;
}

const projectSchema = new Schema({
  id: Types.ObjectId,
  name: String,
  team_id: {
    type: Types.ObjectId,
    ref: 'teams',
  },
  main: String,
  createBy: { type: Types.ObjectId, ref: 'users' },
  branch: [
    {
      name: String,
      createBy: { type: Types.ObjectId, ref: 'users' },
      merge_request: { type: Boolean, default: false },
    },
  ],
});

export default mongoose.model<Project>('projects', projectSchema);
