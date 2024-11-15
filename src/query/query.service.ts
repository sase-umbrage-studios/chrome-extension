import { v4 as uuid } from 'uuid';
import { S3BucketService } from '../integration/s3bucket/s3bucket.service.js';
import { OpenAiService } from '../integration/openai/openai.service.js';

export class QueryService {
  s3BucketService: S3BucketService;
  openaiService: OpenAiService;

  constructor() {
    this.query=this.query.bind(this);
    this.openaiService = new OpenAiService();
    this.s3BucketService = new S3BucketService('sase-chrome-extension-001');
  }

  async query(imageDataUrl: string, queryText: string) {
    const uuidFileName = uuid() + '.png';
    const hostedImageUrl = await this.s3BucketService.saveImageToBucket(imageDataUrl, uuidFileName);
    const queryResult = await this.openaiService.queryImage(hostedImageUrl, queryText);
    await this.s3BucketService.removeImageFromBucket(uuidFileName);
    return queryResult;
  }
}
