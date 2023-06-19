import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const userSchema = new Schema({
  id: Types.ObjectId,
  name: String,
  email: String,
  token: String,
  provider: String,
});

export default mongoose.model('users', userSchema);
