import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  blog: mongoose.Types.ObjectId;
  createdAt: Date;
}

const CommentSchema: Schema = new Schema({
  content: { type: String, required: true, trim: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
}, { timestamps: true });

export default mongoose.model<IComment>('Comment', CommentSchema);
