export type AppConfig = {
  jwtSecret: string;
  otpLength: number;
  examinerSalt: string;
};

export const generateAppConfig = (): AppConfig => ({
  jwtSecret: process.env.JWT_SECRET || '',
  otpLength: parseInt(process.env.OTP_LENGTH || '6') || 6,
  examinerSalt: process.env.EXAMINER_SALT || '',
});
