import { Redis } from '@upstash/redis';
import { CONSTANTS } from '../common/constants/constants';

export interface ChatMember {
  id: number;
  name: string;
  username?: string;
}

const redis = new Redis({
  url: CONSTANTS.UPSTASH_REDIS_REST_URL,
  token: CONSTANTS.UPSTASH_REDIS_REST_TOKEN,
});

const CHATS_KEY = 'chats';

function membersKey(chatId: number | string): string {
  return `chat:${chatId}:members`;
}

export async function addMember(chatId: number | string, member: ChatMember): Promise<void> {
  await redis.sadd(CHATS_KEY, String(chatId));

  const raw = await redis.get<string>(membersKey(chatId));
  const members: ChatMember[] = raw ? (JSON.parse(raw) as ChatMember[]) : [];

  const exists = members.some((m) => m.id === member.id);
  if (!exists) {
    members.push(member);
    await redis.set(membersKey(chatId), JSON.stringify(members));
  }
}

export async function removeMember(chatId: number | string, memberId: number): Promise<void> {
  const raw = await redis.get<string>(membersKey(chatId));
  if (!raw) return;

  const members: ChatMember[] = JSON.parse(raw) as ChatMember[];
  const updated = members.filter((m) => m.id !== memberId);
  await redis.set(membersKey(chatId), JSON.stringify(updated));
}

export async function getMembers(chatId: number | string): Promise<ChatMember[]> {
  const raw = await redis.get<string>(membersKey(chatId));
  if (!raw) return [];
  return JSON.parse(raw) as ChatMember[];
}

export async function getAllChatIds(): Promise<string[]> {
  return redis.smembers(CHATS_KEY);
}
