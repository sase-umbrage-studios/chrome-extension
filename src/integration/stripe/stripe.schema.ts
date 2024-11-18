import mongoose from 'mongoose';

export interface IStripeSession {
  sessionId: string;
  userId: string;
  redirectUrl: string;
  createdAt: string;
}

const schema = new mongoose.Schema<IStripeSession>({
  sessionId: { type: String, unique: true, required: true },
  userId: { type: String, required: true },
  redirectUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
});

export const StripeSessionModel = mongoose.model('Stripe-Session', schema);
