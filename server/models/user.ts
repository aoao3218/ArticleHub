import { Schema, Types } from 'mongoose';
import mongoose from 'mongoose';

const userSchema = new Schema({
  id: Types.ObjectId,
  name: String,
  email: { type: String, required: true },
  password: { type: String, required: true },
  provider: String,
});

export default mongoose.model('users', userSchema);
