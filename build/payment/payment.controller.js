import { StripeService } from '../integration/stripe/stripe.service.js';
import { PaymentService } from './payment.service.js';
export class PaymentController {
    app;
    paymentService;
    stripeService;
    constructor(app, authenticateUserMiddleware) {
        this.createCheckoutUrl = this.createCheckoutUrl.bind(this);
        this.handleSuccessfulPayment = this.handleSuccessfulPayment.bind(this);
        this.handleUnsuccessfulPayment = this.handleUnsuccessfulPayment.bind(this);
        this.paymentService = new PaymentService();
        this.stripeService = new StripeService();
        this.app = app;
        console.log(`[Server]: Serving POST "/api/payment/checkout-url"`);
        console.log(`[Server]: Serving GET "/api/payment/complete-payment"`);
        console.log(`[Server]: Serving GET "/api/payment/cancel-payment"`);
        this.app.post('/api/payment/checkout-url', authenticateUserMiddleware, this.createCheckoutUrl);
        this.app.get('/api/payment/complete-payment', this.handleSuccessfulPayment);
        this.app.get('/api/payment/cancel-payment', this.handleUnsuccessfulPayment);
    }
    async createCheckoutUrl(req, res) {
        const { redirectUrl } = req.body;
        if (!redirectUrl)
            res.status(400).end('Missing redirect url');
        else {
            const userId = req.userId;
            if (!userId)
                res.status(401).send('Cannot retrieve userId from token');
            else {
                const checkoutUrl = await this.stripeService.createCheckoutUrl(userId, redirectUrl);
                res.status(200).send(checkoutUrl);
            }
        }
    }
    async handleSuccessfulPayment(req, res) {
        const { user_id } = req.query;
        if (!user_id) {
            res.status(400).end('Missing user_id in url query');
        }
        else {
            const redirectUrl = await this.paymentService.handleSuccessfulPayment(user_id);
            res.redirect(redirectUrl);
        }
    }
    async handleUnsuccessfulPayment(req, res) {
        const { user_id } = req.query;
        if (!user_id) {
            res.status(400).end('Missing user_id in url query');
        }
        else {
            const redirectUrl = await this.paymentService.handleUnsuccessfulPayment(user_id);
            res.redirect(redirectUrl);
        }
    }
}
