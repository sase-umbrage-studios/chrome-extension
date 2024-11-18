import { QueryService } from './query.service.js';
import { UserService } from '../user/user.service.js';
export class QueryController {
    app;
    userService;
    queryService;
    constructor(app, authenticateUserMiddleware) {
        this.query = this.query.bind(this);
        this.app = app;
        this.userService = new UserService();
        this.queryService = new QueryService();
        console.log(`[Server]: Serving POST "/api/query"`);
        this.app.post('/api/query', authenticateUserMiddleware, this.query);
    }
    async query(req, res) {
        const { imageDataUrl, queryText } = req.body;
        const user = await this.userService.userRepository.findOneById(req.userId);
        if (!user)
            return res.status(500).send('Error: cannot find user');
        if (user.credits < 1)
            return res.status(402).send('Out of credits, please refresh');
        if (!imageDataUrl)
            return res.status(400).send('Error: missing `imageDataUrl` field.');
        if (!queryText)
            return res.status(400).send('Error: missing `queryText` field.');
        const queryResult = await this.queryService.query(imageDataUrl, queryText);
        await this.userService.userRepository.updateOneById(req.userId, { credits: user.credits - 1 });
        return res.status(200).send(queryResult);
    }
}
