import { generateAppConfig } from './AppConfig';
import { generateDatabaseConfig } from './DatabaseConfig';
import { generateS3Config } from './S3Config';
import { generateSendgridConfig } from './SendgridConfig';
import { generateStuauthConfig } from './StuauthConfig';

export const configuration = () => ({
  app: generateAppConfig(),
  database: generateDatabaseConfig(),
  s3: generateS3Config(),
  sendgrid: generateSendgridConfig(),
  stuauth: generateStuauthConfig(),
});
