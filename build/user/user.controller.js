import { UserService } from './user.service.js';
export class UserController {
    userService;
    app;
    constructor(app, authenticateUserMiddleware) {
        this.getOrCreateUser = this.getOrCreateUser.bind(this);
        this.app = app;
        this.userService = new UserService();
        console.log(`[Server]: Serving GET "/api/user"`);
        this.app.get('/api/user', authenticateUserMiddleware, this.getOrCreateUser);
    }
    async getOrCreateUser(req, res) {
        const user = await this.userService.getOrCreateUser(req['userId']);
        res.status(200).send(user);
    }
}
