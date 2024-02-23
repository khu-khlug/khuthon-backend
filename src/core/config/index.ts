import { generateDatabaseConfig } from './DatabaseConfig';
import { generateS3Config } from './S3Config';

export const configuration = () => ({
  database: generateDatabaseConfig(),
  s3: generateS3Config(),
});
