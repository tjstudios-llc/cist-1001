import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const config = {
  port: process.env.PORT || 4000,
  sessionSecret: process.env.SESSION_SECRET || 'development-secret',
  databaseUrl: process.env.DATABASE_URL || path.join(__dirname, '..', '..', 'data', 'dev.db'),
  github: {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    callbackUrl: process.env.GITHUB_CALLBACK_URL || 'http://localhost:4000/auth/github/callback'
  }
};
