import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadHistory, saveHistory } from './historyService.js';
import { buildSongInsight } from './insightService.js';
import { fetchTopSongsJP, filterUnrecommended } from './itunesService.js';
import { renderSite } from './pageService.js';
import { selectDailyPicks } from './selectionService.js';

const SITE_DIR = path.resolve(process.cwd(), 'site');
const MAX_CATEGORIES = 3;

async function main(): Promise<void> {
  const [songs, history] = await Promise.all([fetchTopSongsJP(), loadHistory()]);
  const recommendedIds = history.entries.map((entry) => entry.id);
  const candidates = filterUnrecommended(songs, recommendedIds);
  const picks = selectDailyPicks(candidates, MAX_CATEGORIES);

  if (picks.length === 0) {
    console.log('今日榜單中的歌曲皆已推薦過，略過本次更新。');
  } else {
    const recommendedAt = new Date().toISOString();
    const newEntries = picks.map((song) => {
      console.log(`本次推薦：${song.name} - ${song.artist}`);
      return { ...song, recommendedAt, insight: buildSongInsight(song) };
    });

    history.entries = [...newEntries, ...history.entries];
    await saveHistory(history);
  }

  await mkdir(SITE_DIR, { recursive: true });
  await writeFile(path.join(SITE_DIR, 'index.html'), renderSite(history), 'utf-8');
  console.log('已更新前端頁面 site/index.html');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
