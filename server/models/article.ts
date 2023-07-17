import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

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

articleSchema.index({ article_id: 1, branch: 1 });

export default mongoose.model('articles', articleSchema);
