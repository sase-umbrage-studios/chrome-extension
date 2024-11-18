import dotenv from 'dotenv';
import Stripe from 'stripe';
import { StripeSessionRepository } from './stripe.repository.js';
dotenv.config();
const BACKEND_HOST = process.env.BACKEND_HOST;
export class StripeService {
    stripeSessionRepository;
    stripe;
    constructor() {
        this.createCheckoutUrl = this.createCheckoutUrl.bind(this);
        this.stripeSessionRepository = new StripeSessionRepository();
        this.stripe = new Stripe(process.env.STRIPE_API_KEY ?? '');
    }
    async createCheckoutUrl(userId, redirectUrl) {
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: '125 Credits'
                        },
                        unit_amount: 699
                    },
                    quantity: 1
                }
            ],
            success_url: `${BACKEND_HOST}/api/payment/complete-payment?user_id=${userId}`,
            cancel_url: `${BACKEND_HOST}/api/payment/cancel-payment?user_id=${userId}`,
        });
        try {
            const existingStripeSession = await this.stripeSessionRepository.findOneByUserId(userId);
            if (existingStripeSession)
                await this.stripeSessionRepository.deleteOneBySessionId(existingStripeSession.sessionId);
        }
        catch (error) {
            console.error(`[Server]: Error - Found existing session and failed to remove it - ${error}`);
        }
        await this.stripeSessionRepository.createOne(session.id, userId, redirectUrl);
        return session.url;
    }
}
