import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { bot } from './controllers/telegram/bot';
import { scheduleDailyTaskJob, runDailyTask } from './jobs/daily-task.job';
import config from './common/config/config';

const app = express();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.post('/trigger', async (_req, res) => {
  try {
    await runDailyTask();
    res.json({ status: 'ok', message: 'Daily task triggered' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: String(err) });
  }
});

const start = async () => {
  try {
    scheduleDailyTaskJob();
    await bot.launch({
      allowedUpdates: ['message', 'chat_member', 'my_chat_member'],
    });
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
