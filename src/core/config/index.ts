import { generateDatabaseConfig } from './database.config';

export const configuration = () => ({
  database: generateDatabaseConfig(),
});
