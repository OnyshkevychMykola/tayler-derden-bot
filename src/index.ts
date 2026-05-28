import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { bot } from './controllers/telegram/bot';
import { scheduleDailyTaskJob } from './jobs/daily-task.job';
import config from './common/config/config';

const app = express();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const start = async () => {
  try {
    scheduleDailyTaskJob();
    await bot.launch();
    console.log('Bot started (polling)');
  } catch (err) {
    console.error('Startup error:', err);
    process.exit(1);
  }
};

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
  start();
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
