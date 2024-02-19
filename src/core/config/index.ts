import { generateDatabaseConfig } from './DatabaseConfig';

export const configuration = () => ({
  database: generateDatabaseConfig(),
});
