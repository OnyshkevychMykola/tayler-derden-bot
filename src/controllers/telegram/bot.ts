import { Telegraf } from 'telegraf';
import { CONSTANTS } from '../../common/constants/constants';
import { addMember, removeMember } from '../../service/storage.service';

export const bot = new Telegraf(CONSTANTS.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const message = ctx.message;
  const chatId = ctx.chat?.id;
  const user = ctx.from;

  if (chatId && user && !user.is_bot) {
    const isGroup = ctx.chat?.type === 'group' || ctx.chat?.type === 'supergroup';
    if (isGroup) {
      await addMember(chatId, {
        id: user.id,
        name: user.first_name,
        username: user.username,
      });
    }
  }

  return next();
});

bot.on('my_chat_member', async (ctx) => {
  const update = ctx.myChatMember;
  const chatId = update.chat.id;
  const newStatus = update.new_chat_member.status;

  if (newStatus === 'left' || newStatus === 'kicked') {
    await removeMember(chatId, update.new_chat_member.user.id);
  }
});

bot.on('chat_member', async (ctx) => {
  const update = ctx.chatMember;
  const chatId = update.chat.id;
  const member = update.new_chat_member;

  if (member.status === 'left' || member.status === 'kicked') {
    await removeMember(chatId, member.user.id);
  } else if (
    (member.status === 'member' || member.status === 'administrator') &&
    !member.user.is_bot
  ) {
    await addMember(chatId, {
      id: member.user.id,
      name: member.user.first_name,
      username: member.user.username,
    });
  }
});
