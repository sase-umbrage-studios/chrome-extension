import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    credits: { type: Number, required: true },
});
export const UserModel = mongoose.model('user', schema);
