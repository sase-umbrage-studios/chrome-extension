import dotenv from 'dotenv';
import Stripe from 'stripe';
import { StripeSessionRepository } from './stripe.repository.js';

dotenv.config();

export class StripeService {
  stripeSessionRepository: StripeSessionRepository;
  stripe: Stripe;

  constructor() {
    this.createCheckoutUrl=this.createCheckoutUrl.bind(this);
    this.stripeSessionRepository = new StripeSessionRepository();
    this.stripe = new Stripe(process.env.STRIPE_API_KEY ?? '');
  }

  async createCheckoutUrl(userId: string, redirectUrl: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '50 Credits'
            },
            unit_amount: 500
          },
          quantity: 1
        }
      ],
      success_url: `http://localhost:3000/api/payment/complete-payment?user_id=${userId}`,
      cancel_url: `http://localhost:3000/api/payment/cancel-payment?user_id=${userId}`,
    });

    try {
      const existingStripeSession = await this.stripeSessionRepository.findOneByUserId(userId);
      if (existingStripeSession) await this.stripeSessionRepository.deleteOneBySessionId(existingStripeSession.sessionId);
    } catch (error) {
      console.error(`[Server]: Error - Found existing session and failed to remove it - ${error}`);
    }

    await this.stripeSessionRepository.createOne(session.id, userId, redirectUrl);
    return session.url;
  }
}
