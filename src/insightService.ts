import type { ITunesSong, SongInsight } from './types.js';

function formatReleaseDate(releaseDate?: string): string | undefined {
  if (!releaseDate) return undefined;
  const date = new Date(releaseDate);
  if (Number.isNaN(date.getTime())) return undefined;
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
}

export function buildSongInsight(song: ITunesSong): SongInsight {
  const genre = song.genre ?? '流行音樂';
  const releaseDate = formatReleaseDate(song.releaseDate);

  const 歌手簡介 = `${song.artist} 是這次登上 iTunes 日本單曲榜的藝人，以《${song.name}》這首 ${genre} 作品獲得不少關注，展現出其在樂壇的人氣與影響力。`;

  const 創作理念 = releaseDate
    ? `《${song.name}》於 ${releaseDate} 發行，屬於 ${genre} 曲風，是 ${song.artist} 近期受到聽眾喜愛的代表作之一。`
    : `《${song.name}》屬於 ${genre} 曲風，是 ${song.artist} 近期受到聽眾喜愛的代表作之一。`;

  return { 歌手簡介, 創作理念 };
}
