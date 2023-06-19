import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const publishSchema = new Schema({
  id: Types.ObjectId,
  title: String,
  content: String,
  author: Number,
});

export default mongoose.model('publish', publishSchema);
