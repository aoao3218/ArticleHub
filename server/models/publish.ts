import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const publishSchema = new Schema({
  article_id: String,
  title: String,
  content: String,
  author: { type: Types.ObjectId, ref: 'users' },
});

export default mongoose.model('publish', publishSchema);
