import type { ITunesSong, SongInsight } from './types.js';

export interface DiscordPayload {
  username: string;
  embeds: unknown[];
}

export function buildDiscordPayload(song: ITunesSong, insight: SongInsight): DiscordPayload {
  return {
    username: 'Daily Music JP',
    embeds: [
      {
        title: `${song.name} - ${song.artist}`,
        url: song.trackViewUrl,
        color: 0x1db954,
        thumbnail: { url: song.artworkUrl },
        fields: [
          { name: '🎤 歌手簡介', value: insight.歌手簡介.slice(0, 1024) },
          { name: '💡 創作理念', value: insight.創作理念.slice(0, 1024) },
        ],
        footer: { text: 'iTunes 日本每日單曲榜' },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

export async function sendToDiscord(webhookUrl: string, payload: DiscordPayload): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Discord webhook 發送失敗 (${res.status}): ${body}`);
  }
}
