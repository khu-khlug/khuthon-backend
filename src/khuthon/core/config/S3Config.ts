export type S3Config = {
  region: string;
  bucket: string;
  accessKeyId: string;
  secretAccessKey: string;
  cdnUrl: string;
};

export const generateS3Config = (): S3Config => ({
  region: process.env.AWS_REGION || '',
  bucket: process.env.AWS_BUCKET || '',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  cdnUrl: process.env.AWS_CDN_URL || '',
});
