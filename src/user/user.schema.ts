import mongoose from 'mongoose';

export interface IUser {
  id: string;
  credits: number;
}

const schema = new mongoose.Schema<IUser>({
  id: { type: String, required: true, unique: true },
  credits: { type: Number, required: true },
});

export const UserModel = mongoose.model('user', schema);
