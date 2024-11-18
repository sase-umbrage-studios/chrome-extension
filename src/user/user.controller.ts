import { Express, NextFunction, Request, Response } from 'express';
import { UserService } from './user.service.js';

export class UserController {
  userService: UserService;
  app: Express;

  constructor(app: Express, authenticateUserMiddleware: (req: Request, res: Response, next: NextFunction) => void) {
    this.getOrCreateUser=this.getOrCreateUser.bind(this);
    this.app = app;
    this.userService = new UserService();
    console.log(`[Server]: Serving GET "/api/user"`);
    this.app.get('/api/user', authenticateUserMiddleware, this.getOrCreateUser);
  }

  async getOrCreateUser(req: Request, res: Response) {
    const user = await this.userService.getOrCreateUser((req as any)['userId']);
    res.status(200).send(user);
  }
}
