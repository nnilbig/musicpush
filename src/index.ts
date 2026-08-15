import { generateSongInsight } from './aiService.js';
import { buildDiscordPayload, sendToDiscord } from './discordService.js';
import { loadHistory, saveHistory } from './historyService.js';
import { fetchTopSongsJP, filterUnrecommended } from './itunesService.js';

async function main(): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('缺少 DISCORD_WEBHOOK_URL 環境變數');
  }

  const [songs, history] = await Promise.all([fetchTopSongsJP(), loadHistory()]);
  const candidates = filterUnrecommended(songs, history.recommendedIds);

  if (candidates.length === 0) {
    console.log('今日榜單中的歌曲皆已推薦過，略過本次推播。');
    return;
  }

  const song = candidates[0];
  console.log(`本次推薦：${song.name} - ${song.artist}`);

  const insight = await generateSongInsight(song.name, song.artist);
  const payload = buildDiscordPayload(song, insight);
  await sendToDiscord(webhookUrl, payload);

  history.recommendedIds.push(song.id);
  await saveHistory(history);

  console.log('推播完成，已更新推薦歷史。');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
