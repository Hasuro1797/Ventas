import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  text: String,
  date: Date,
});

const PreferenceSchema = new mongoose.Schema({
  language: String,
  paid_method: String,
  notifications: Boolean,
});

const ClientInfoSchema = new mongoose.Schema({
  client_id: Number,
  comments: [CommentSchema],
  preferences: PreferenceSchema
});

export default  mongoose.models.ClientInfo || mongoose.model('ClientInfo', ClientInfoSchema, 'clientInfo');
