import type { ITunesSong } from './types.js';

export const DEFAULT_GENRE = '其他';

export function selectDailyPicks(candidates: ITunesSong[], maxCategories: number): ITunesSong[] {
  const picks: ITunesSong[] = [];
  const seenGenres = new Set<string>();

  for (const song of candidates) {
    const genre = song.genre ?? DEFAULT_GENRE;
    if (seenGenres.has(genre)) continue;
    seenGenres.add(genre);
    picks.push(song);
    if (picks.length >= maxCategories) break;
  }

  return picks;
}
