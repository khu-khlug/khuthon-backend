export type SendgridConfig = {
  apiKey: string;
  baseUrl: string;
};

export const generateSendgridConfig = (): SendgridConfig => ({
  apiKey: process.env.SENDGRID_API_KEY || '',
  baseUrl: process.env.SENDGRID_BASE_URL || '',
});
