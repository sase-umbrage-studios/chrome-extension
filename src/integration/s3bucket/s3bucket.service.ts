import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config();

export class S3BucketService {
  s3: AWS.S3;
  bucketName: string;

  constructor(bucketName: string) {
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    this.s3 = new AWS.S3();
    this.bucketName = bucketName;
    this.saveImageToBucket=this.saveImageToBucket.bind(this);
    this.removeImageFromBucket=this.removeImageFromBucket.bind(this);
  }

  async saveImageToBucket(imageDataUrl: string, fileName: string) {
    const base64Data = Buffer.from(imageDataUrl.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const contentType = imageDataUrl.split(';')[0].split(':')[1];
    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: fileName,
      Body: base64Data,
      ContentEncoding: 'base64',
      ContentType: contentType,
    };
    try {
      await this.s3.upload(params).promise();
      return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw error;
    }
  }

  async removeImageFromBucket(fileName: string) {
    const params: AWS.S3.DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: fileName,
    };
  
    try {
      await this.s3.deleteObject(params).promise();
      console.log(`Image ${fileName} deleted successfully from S3`);
    } catch (error) {
      console.error('Error deleting image from S3:', error);
      throw error;
    }
  }
}
