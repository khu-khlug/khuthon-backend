export type AppConfig = {
  jwtSecret: string;
  otpLength: number;
};

export const generateAppConfig = (): AppConfig => ({
  jwtSecret: process.env.JWT_SECRET || '',
  otpLength: parseInt(process.env.OTP_LENGTH || '6') || 6,
});
