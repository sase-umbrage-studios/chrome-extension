import mongoose from 'mongoose';
import { IStripeSession, StripeSessionModel } from './stripe.schema.js';

export class StripeSessionRepository {
  StripeSessionModel: mongoose.Model<IStripeSession>

  constructor() {
    this.findOneBySessionId=this.findOneBySessionId.bind(this);
    this.findOneByUserId=this.findOneByUserId.bind(this);
    this.createOne=this.createOne.bind(this);
    this.deleteOneBySessionId=this.deleteOneBySessionId.bind(this);
    this.StripeSessionModel = StripeSessionModel;
  }

  async findOneBySessionId(sessionId: string) {
    const stripeSession = await this.StripeSessionModel.findOne({ sessionId });
    return stripeSession;
  }

  async findOneByUserId(userId: string) {
    const stripeSession = await this.StripeSessionModel.findOne({ userId });
    return stripeSession;
  }

  async createOne(sessionId: string, userId: string, redirectUrl: string) {
    const createdAt = new Date().toISOString();
    const stripeSession = new this.StripeSessionModel({ sessionId, userId, redirectUrl, createdAt });
    await stripeSession.save();
    const constructedStripeSession: IStripeSession = { sessionId, userId, redirectUrl, createdAt }
    return constructedStripeSession;
  }

  async deleteOneBySessionId(sessionId: string) {
    const deleteOneResponse = await this.StripeSessionModel.deleteOne({ sessionId });
    return deleteOneResponse;
  }
}
