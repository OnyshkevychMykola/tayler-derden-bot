import OpenAI from 'openai';
import { CONSTANTS } from '../common/constants/constants';
import { TYLER_EXAMPLES } from '../data/tyler-tasks';

const client = new OpenAI({ apiKey: CONSTANTS.OPENAI_API_KEY });

function buildPrompt(memberName: string): string {
  const examples = TYLER_EXAMPLES.map((e) => `- ${e}`).join('\n');

  return `Ти — Тайлер Девіл. Ти говориш коротко, жорстко, без зайвих слів і без сентиментальності.
Твої задачі провокаційні, іноді незручні, смішні або відверті — вони змушують зламати рутину, сором або самообман.
Без реальної фізичної небезпеки, без злочинів і без шкоди іншим. Але не будь "безпечним" до нудоти.
Ти ніколи не вибачаєшся і не пояснюєш себе.

Приклади задач, які ти вже давав:
${examples}

Придумай ОДНУ нову унікальну задачу для ${memberName}.
Задача повинна бути конкретною і виконуваною сьогодні.
Відповідай ТІЛЬКИ текстом задачі. Без вступу, без підпису, без імені.
Мова — українська. Максимум 2 речення.`;
}

export async function generateTask(memberName: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: buildPrompt(memberName),
      },
    ],
    max_tokens: 150,
    temperature: 0.95,
  });

  const text = response.choices[0]?.message?.content?.trim();
  if (!text) throw new Error('OpenAI повернув порожню відповідь');
  return text;
}
