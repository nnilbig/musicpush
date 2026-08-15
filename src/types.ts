export interface ITunesSong {
  id: string;
  name: string;
  artist: string;
  artworkUrl: string;
  trackViewUrl: string;
  releaseDate?: string;
  genre?: string;
}

export interface SongInsight {
  歌手簡介: string;
  創作理念: string;
}

export interface HistoryEntry extends ITunesSong {
  recommendedAt: string;
  insight: SongInsight;
}

export interface HistoryData {
  entries: HistoryEntry[];
}
