import dotenv from 'dotenv';
dotenv.config();

interface Config {
  port: number;
  cronSchedule: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  cronSchedule: process.env.CRON_SCHEDULE || '0 9 * * *',
};

export default config;
