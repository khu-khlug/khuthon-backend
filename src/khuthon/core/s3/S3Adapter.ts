import {
  DeleteObjectCommand,
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createPresignedPost, PresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { S3Config } from '@khlug/khuthon/core/config/S3Config';

const _10MB = 10 * 1024 * 1024;

@Injectable()
export class S3Adapter {
  private client: S3Client;
  private bucket: string;

  constructor(configService: ConfigService) {
    const config = configService.get('s3') as S3Config;

    this.client = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
    this.bucket = config.bucket;
  }

  async getSignedUrl(
    fileKey: string,
    expiresIn: number = 10 * 60,
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: fileKey });
    const signedUrl = await getSignedUrl(this.client, command, { expiresIn });
    return signedUrl;
  }

  async getPresignedPost(
    fileKey: string,
    expiresIn: number = 5 * 60,
  ): Promise<PresignedPost> {
    return await createPresignedPost(this.client, {
      Bucket: this.bucket,
      Key: fileKey,
      Conditions: [
        ['eq', '$Content-Type', 'application/pdf'],
        ['content-length-range', 0, _10MB],
      ],
      Expires: expiresIn,
    });
  }

  async deleteObject(fileKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: fileKey,
    });
    await this.client.send(command);
  }
}
