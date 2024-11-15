import { Express, Request, Response } from 'express';
import { QueryService } from './query.service.js';

export class QueryController {
  app: Express;
  queryService: QueryService;

  constructor(app: Express) {
    this.query=this.query.bind(this);
    this.app = app;
    this.queryService = new QueryService();
    this.app.post('/api/query', this.query as any);
  }

  async query(req: Request, res: Response) {
    const { imageDataUrl, queryText } = req.body;
    if (!imageDataUrl) return res.status(400).send('Error: missing `imageDataUrl` field.');
    if (!queryText) return res.status(400).send('Error: missing `queryText` field.');
    const queryResult = await this.queryService.query(imageDataUrl, queryText);
    return res.status(200).send(queryResult);
  }
}
