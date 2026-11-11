export interface Artist {
  id: number;
  name: string;
  picture?: string;
  picture_small?: string;
  picture_medium?: string;
  picture_big?: string;
}

export interface Album {
  id: number;
  title: string;
  cover?: string;
  cover_small?: string;
  cover_medium?: string;
  cover_big?: string;
  cover_xl?: string;
}

export interface Song {
  id: number;
  title: string;
  title_short?: string;
  duration?: number;
  preview?: string;
  link?: string;
  artist: Artist;
  album: Album;
}

export interface SuggestResponse {
  data: Song[];
  total?: number;
}

export interface LyricsResponse {
  lyrics?: string;
  error?: string;
}

