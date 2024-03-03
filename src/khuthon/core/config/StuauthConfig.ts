export type StuauthConfig = {
  apiUri: string;
  token: string;
};

export const generateStuauthConfig = (): StuauthConfig => ({
  apiUri: process.env.STUAUTH_API_URI || '',
  token: process.env.STUAUTH_TOKEN || '',
});
