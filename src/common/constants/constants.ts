import dotenv from 'dotenv';
dotenv.config();

export const CONSTANTS = {
  BOT_TOKEN: process.env.BOT_TOKEN as string,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY as string,
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL as string,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN as string,
  CRON_SCHEDULE: process.env.CRON_SCHEDULE || '0 9 * * *',
  PORT: process.env.PORT || '3000',
};
