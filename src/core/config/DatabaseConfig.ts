export type DatabaseConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
  synchronize: boolean;
};

export const generateDatabaseConfig = (): DatabaseConfig => ({
  host: process.env.MYSQL_HOST || '',
  port: parseInt(process.env.MYSQL_PORT || '3306') || 3306,
  user: process.env.MYSQL_USER || '',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || '',
  synchronize: (process.env.DATABASE_SYNC || 'false').toLowerCase() === 'true',
});
