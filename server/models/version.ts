import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const versionSchema = new Schema({
  article_id: String,
  branch: String,
  history: [Array],
  previous_index: Number,
  update_index: Number,
});

export default mongoose.model('versions', versionSchema);
