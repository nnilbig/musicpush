import type { HistoryData, HistoryEntry } from './types.js';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function youtubeSearchUrl(name: string, artist: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${artist} ${name}`)}`;
}

function renderCard(entry: HistoryEntry, isToday: boolean): string {
  return `
    <article class="card${isToday ? ' latest' : ''}">
      ${isToday ? '<span class="badge">今日推薦</span>' : ''}
      <img class="artwork" src="${escapeHtml(entry.artworkUrl)}" alt="${escapeHtml(entry.name)}" loading="lazy" />
      <div class="content">
        <h2>${escapeHtml(entry.name)}</h2>
        <p class="artist">${escapeHtml(entry.artist)}</p>
        <p class="date">${formatDate(entry.recommendedAt)}</p>
        <p class="links">
          <a href="${escapeHtml(entry.trackViewUrl)}" target="_blank" rel="noopener">Apple Music</a>
          ・
          <a href="${escapeHtml(youtubeSearchUrl(entry.name, entry.artist))}" target="_blank" rel="noopener">YouTube 搜尋</a>
        </p>
        <div class="insight">
          <h3>🎤 歌手簡介</h3>
          <p>${escapeHtml(entry.insight.歌手簡介)}</p>
          <h3>💡 創作理念</h3>
          <p>${escapeHtml(entry.insight.創作理念)}</p>
        </div>
      </div>
    </article>`;
}

export function renderSite(history: HistoryData): string {
  const today = formatDate(new Date().toISOString());
  const cards = history.entries.map((entry) => renderCard(entry, formatDate(entry.recommendedAt) === today)).join('\n');
  const updated = history.entries[0] ? formatDate(history.entries[0].recommendedAt) : '尚未產生';

  return `<!doctype html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>每日日本單曲推薦</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: -apple-system, "PingFang TC", "Microsoft JhengHei", sans-serif; max-width: 720px; margin: 0 auto; padding: 24px 16px 64px; background: #0f1115; color: #eaeaea; }
  header { margin-bottom: 24px; }
  h1 { font-size: 1.5rem; margin-bottom: 4px; }
  .updated { color: #9a9a9a; font-size: 0.85rem; }
  .card { display: flex; gap: 16px; background: #1a1d24; border-radius: 12px; padding: 16px; margin-bottom: 16px; position: relative; }
  .card.latest { border: 1px solid #1db954; }
  .badge { position: absolute; top: -10px; left: 16px; background: #1db954; color: #06110b; font-size: 0.75rem; padding: 2px 8px; border-radius: 999px; font-weight: 600; }
  .artwork { width: 96px; height: 96px; border-radius: 8px; object-fit: cover; flex-shrink: 0; }
  .content h2 { font-size: 1.1rem; margin: 0 0 4px; }
  .content h2 a { color: #fff; text-decoration: none; }
  .content h2 a:hover { text-decoration: underline; }
  .artist { color: #b8b8b8; margin: 0 0 2px; }
  .date { color: #777; font-size: 0.8rem; margin: 0 0 4px; }
  .links { font-size: 0.85rem; margin: 0 0 12px; }
  .links a { color: #6fb6ff; text-decoration: none; }
  .links a:hover { text-decoration: underline; }
  .insight h3 { font-size: 0.85rem; margin: 8px 0 2px; color: #9fd8b6; }
  .insight p { margin: 0; font-size: 0.9rem; line-height: 1.5; color: #d5d5d5; }
</style>
</head>
<body>
<header>
  <h1>每日日本單曲推薦</h1>
  <p class="updated">最後更新：${updated}（來源：iTunes 日本單曲榜）</p>
</header>
<main>
${cards || '<p>尚無推薦紀錄。</p>'}
</main>
</body>
</html>
`;
}
