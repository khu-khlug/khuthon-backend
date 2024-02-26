export type AppConfig = {
  jwtSecret: string;
};

export const generateAppConfig = (): AppConfig => ({
  jwtSecret: process.env.JWT_SECRET || '',
});
