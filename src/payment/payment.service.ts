import { StripeService } from '../integration/stripe/stripe.service.js';
import { UserService } from '../user/user.service.js';

export class PaymentService {
  stripeService: StripeService;
  userService: UserService;

  constructor() {
    this.handleSuccessfulPayment=this.handleSuccessfulPayment.bind(this);
    this.handleUnsuccessfulPayment=this.handleUnsuccessfulPayment.bind(this);
    this.stripeService = new StripeService();
    this.userService = new UserService();
  }

  async handleSuccessfulPayment(userId: string) {
    const stripeSession = await this.stripeService.stripeSessionRepository.findOneByUserId(userId);
    if (!stripeSession) throw Error('Cannot find session');
    const session = await this.stripeService.stripe.checkout.sessions.retrieve(stripeSession.sessionId);
    if (session.payment_status === 'unpaid') throw Error('Payment not completed');
    await this.stripeService.stripeSessionRepository.deleteOneBySessionId(session.id);
    const user = await this.userService.userRepository.findOneById(userId);
    if (!user) throw 'Cannot find user';
    await this.userService.userRepository.updateOneById(userId, { credits: user.credits + 50 });
    return stripeSession.redirectUrl;
  }

  async handleUnsuccessfulPayment(userId: string) {
    const stripeSession = await this.stripeService.stripeSessionRepository.findOneByUserId(userId);
    if (!stripeSession) throw Error('Cannot find session');
    const session = await this.stripeService.stripe.checkout.sessions.retrieve(stripeSession.sessionId);
    await this.stripeService.stripeSessionRepository.deleteOneBySessionId(session.id);
    return stripeSession.redirectUrl;
  }
}
