import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

interface Version {
  article_id: string;
  branch: string;
  history: Array<Array<any>>;
  previous_index: number;
  update_index: Number;
}

const versionSchema = new Schema({
  article_id: String,
  branch: String,
  history: [Array],
  previous_index: Number,
  update_index: Number,
});

export default mongoose.model('versions', versionSchema);
