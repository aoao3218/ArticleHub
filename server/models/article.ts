import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';
import { object } from 'zod';

const articleSchema = new Schema({
  id: Types.ObjectId,
  project_id: { type: Types.ObjectId, ref: 'projects' },
  article_id: String,
  title: String,
  story: String,
  branch: String,
  history: [Array],
  previous_index: Number,
});

export default mongoose.model('articles', articleSchema);
