import mongoose from 'mongoose';
const schema = new mongoose.Schema({
    sessionId: { type: String, unique: true, required: true },
    userId: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    createdAt: { type: String, required: true },
});
export const StripeSessionModel = mongoose.model('Stripe-Session', schema);
