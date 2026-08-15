import type { ITunesSong } from './types.js';

const ITUNES_JP_TOP_SONGS_URL = 'https://itunes.apple.com/jp/rss/topsongs/limit=50/json';

interface RawImage {
  label: string;
}

interface RawLink {
  attributes: { rel?: string; href: string };
}

interface RawEntry {
  id: { attributes: { 'im:id': string } };
  'im:name': { label: string };
  'im:artist': { label: string };
  'im:image': RawImage[];
  link: RawLink[];
  category?: { attributes: { label: string } };
  'im:releaseDate'?: { label: string };
}

interface RawFeed {
  feed: { entry?: RawEntry[] };
}

export async function fetchTopSongsJP(): Promise<ITunesSong[]> {
  const res = await fetch(ITUNES_JP_TOP_SONGS_URL);
  if (!res.ok) {
    throw new Error(`iTunes RSS 請求失敗: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as RawFeed;
  const entries = data.feed.entry ?? [];

  return entries.map((entry): ITunesSong => ({
    id: entry.id.attributes['im:id'],
    name: entry['im:name'].label,
    artist: entry['im:artist'].label,
    artworkUrl: entry['im:image'].at(-1)?.label ?? '',
    trackViewUrl:
      entry.link.find((l) => l.attributes.rel === 'alternate')?.attributes.href ??
      entry.link[0]?.attributes.href ??
      '',
    releaseDate: entry['im:releaseDate']?.label,
    genre: entry.category?.attributes.label,
  }));
}

export function filterUnrecommended(songs: ITunesSong[], recommendedIds: string[]): ITunesSong[] {
  const seen = new Set(recommendedIds);
  return songs.filter((song) => !seen.has(song.id));
}
