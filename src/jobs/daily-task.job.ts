import cron from 'node-cron';
import { bot } from '../controllers/telegram/bot';
import { getAllChatIds, getMembers } from '../service/storage.service';
import { generateTask } from '../service/ai.service';
import config from '../common/config/config';

async function runDailyTask(): Promise<void> {
  console.log('[DailyTaskJob] Запускаю щоденний вибір...');

  const chatIds = await getAllChatIds();

  if (chatIds.length === 0) {
    console.log('[DailyTaskJob] Немає активних чатів.');
    return;
  }

  for (const chatId of chatIds) {
    try {
      const members = await getMembers(chatId);

      if (members.length === 0) {
        console.log(`[DailyTaskJob] Чат ${chatId}: немає учасників, пропускаю.`);
        continue;
      }

      const chosen = members[Math.floor(Math.random() * members.length)];
      const task = await generateTask(chosen.name);

      const mention = chosen.username ? `@${chosen.username}` : chosen.name;
      const message = `🎯 ${mention} — сьогодні твоя задача від Тайлера Дердена:\n\n${task}`;

      await bot.telegram.sendMessage(chatId, message);
      console.log(`[DailyTaskJob] Чат ${chatId}: задачу надіслано для ${chosen.name}.`);
    } catch (err) {
      console.error(`[DailyTaskJob] Помилка для чату ${chatId}:`, err);
    }
  }
}

export { runDailyTask };

export function scheduleDailyTaskJob(): void {
  cron.schedule(config.cronSchedule, runDailyTask, {
    timezone: 'Europe/Kyiv',
  });

  console.log(`[DailyTaskJob] Заплановано за розкладом: ${config.cronSchedule} (Europe/Kyiv)`);
}
