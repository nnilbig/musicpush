import Anthropic from '@anthropic-ai/sdk';
import type { SongInsight } from './types.js';

const MODEL = process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-5';

let client: Anthropic | undefined;

function getClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('缺少 ANTHROPIC_API_KEY 環境變數');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

function buildPrompt(songName: string, artist: string): string {
  return `你是一位音樂編輯。請針對以下歌曲，只回覆一個 JSON 物件，不要加上任何說明文字或 markdown 標記（例如 \`\`\`）。

歌名：${songName}
歌手：${artist}

JSON 格式必須完全符合：
{
  "歌手簡介": "以繁體中文撰寫，150 字以內，介紹這位歌手的背景與音樂風格",
  "創作理念": "以繁體中文撰寫，150 字以內，說明這首歌可能的創作理念或想傳達的意涵"
}`;
}

export async function generateSongInsight(songName: string, artist: string): Promise<SongInsight> {
  const anthropic = getClient();

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1024,
    messages: [{ role: 'user', content: buildPrompt(songName, artist) }],
  });

  const textBlock = message.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('Anthropic API 未回傳文字內容');
  }

  const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error(`無法從回應中解析 JSON:\n${textBlock.text}`);
  }

  const parsed = JSON.parse(jsonMatch[0]) as Partial<SongInsight>;
  if (!parsed.歌手簡介 || !parsed.創作理念) {
    throw new Error(`回傳的 JSON 缺少必要欄位:\n${jsonMatch[0]}`);
  }

  return { 歌手簡介: parsed.歌手簡介, 創作理念: parsed.創作理念 };
}
