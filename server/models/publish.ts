import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const publishSchema = new Schema({
  article_id: String,
  title: String,
  story: String,
  project_id: { type: Types.ObjectId, ref: 'projects' },
  author: { type: Types.ObjectId, ref: 'users' },
});

export default mongoose.model('publishes', publishSchema);
