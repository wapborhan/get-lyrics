import { useCallback, useEffect, useRef, useState } from "react";
import type { LyricsResponse, Song } from "./types";

interface LyricsProps {
  songs: Song[];
  searchQuery: string;
}

function formatDuration(seconds?: number): string | null {
  if (!seconds || seconds <= 0) return null;
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function Lyrics({ songs, searchQuery }: LyricsProps) {
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLoadingLyrics, setIsLoadingLyrics] = useState(false);
  const [lyricsError, setLyricsError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingSongId(null);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
      abortRef.current?.abort();
    };
  }, [stopAudio]);

  const closeModal = useCallback(() => {
    abortRef.current?.abort();
    setSelectedSong(null);
    setLyrics(null);
    setLyricsError(null);
    setIsLoadingLyrics(false);
    setCopied(false);
  }, []);

  useEffect(() => {
    if (!selectedSong) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSong, closeModal]);

  const handleSelectSong = async (song: Song) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSelectedSong(song);
    setLyrics(null);
    setLyricsError(null);
    setIsLoadingLyrics(true);
    setCopied(false);

    try {
      const artist = encodeURIComponent(song.artist.name);
      const title = encodeURIComponent(song.title);
      const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`, {
        signal: controller.signal,
      });

      const data = (await response.json().catch(() => ({}))) as LyricsResponse;

      if (!response.ok || !data.lyrics?.trim()) {
        setLyricsError(
          data.error || "Lyrics for this track are not available in the Lyrics.ovh catalog yet."
        );
        return;
      }

      setLyrics(data.lyrics.trim());
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setLyricsError("Could not load lyrics right now. Please check your connection and try again.");
    } finally {
      if (!controller.signal.aborted) {
        setIsLoadingLyrics(false);
      }
    }
  };

  const handleTogglePreview = (event: React.MouseEvent, song: Song) => {
    event.stopPropagation();
    if (!song.preview) return;

    if (playingSongId === song.id) {
      stopAudio();
      return;
    }

    stopAudio();
    const audio = new Audio(song.preview);
    audioRef.current = audio;
    setPlayingSongId(song.id);

    const clearPlaying = () => {
      setPlayingSongId((current) => (current === song.id ? null : current));
    };

    audio.addEventListener("ended", clearPlaying);
    audio.addEventListener("error", clearPlaying);

    audio.play().catch(clearPlaying);
  };

  const handleCopyLyrics = async () => {
    if (!lyrics) return;
    try {
      await navigator.clipboard.writeText(lyrics);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 animate-fade-up">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Results for{" "}
            <span className="bg-gradient-to-r from-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              &ldquo;{searchQuery}&rdquo;
            </span>
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Click any track card to open its full lyrics, or preview the 30s audio clip.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-300 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {songs.length} {songs.length === 1 ? "track" : "tracks"} found
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {songs.map((item, index) => {
          const coverUrl =
            item.album.cover_big || item.album.cover_medium || item.album.cover || "";
          const durationLabel = formatDuration(item.duration);
          const isPlaying = playingSongId === item.id;

          return (
            <article
              key={item.id}
              onClick={() => handleSelectSong(item)}
              style={{ animationDelay: `${Math.min(index * 55, 440)}ms` }}
              className={`group animate-fade-up relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-fuchsia-400/40 hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-fuchsia-500/15 ${
                isPlaying
                  ? "border-fuchsia-400/60 bg-white/[0.08] shadow-xl shadow-fuchsia-500/20 ring-1 ring-fuchsia-400/40"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            >
              {/* Cover image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={`${item.album.title} cover`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-fuchsia-900/50 to-slate-900 text-slate-400">
                    No Cover
                  </div>
                )}

                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                {durationLabel && (
                  <span className="absolute top-3 left-3 rounded-full border border-white/15 bg-slate-950/70 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-slate-200 backdrop-blur-md">
                    {durationLabel}
                  </span>
                )}

                {item.preview && (
                  <button
                    type="button"
                    onClick={(e) => handleTogglePreview(e, item)}
                    aria-label={isPlaying ? `Pause preview of ${item.title}` : `Play preview of ${item.title}`}
                    className={`absolute right-3 bottom-3 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition-all duration-200 ${
                      isPlaying
                        ? "border-fuchsia-400 bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/40"
                        : "border-white/20 bg-slate-950/75 text-white hover:scale-110 hover:border-fuchsia-400/60 hover:bg-fuchsia-500/80"
                    }`}
                  >
                    {isPlaying ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 translate-x-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M8 5.14v14l11-7-11-7z" />
                      </svg>
                    )}
                  </button>
                )}
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <h3 className="line-clamp-1 text-lg font-bold text-white transition-colors group-hover:text-fuchsia-200">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 flex items-center gap-2 text-sm font-medium text-slate-300">
                    {item.artist.picture_small ? (
                      <img
                        src={item.artist.picture_small}
                        alt={item.artist.name}
                        className="h-5 w-5 rounded-full object-cover ring-1 ring-white/20"
                      />
                    ) : null}
                    <span className="line-clamp-1">{item.artist.name}</span>
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                    Album: {item.album.title}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectSong(item);
                    }}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-md text-xs font-semibold text-fuchsia-300 transition-colors group-hover:text-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
                  >
                    {isPlaying ? (
                      <>
                        <span className="flex h-3 items-end gap-0.5">
                          <span className="animate-eq-1 h-3 w-0.5 rounded-full bg-fuchsia-400" />
                          <span className="animate-eq-2 h-3 w-0.5 rounded-full bg-cyan-400" />
                          <span className="animate-eq-3 h-3 w-0.5 rounded-full bg-fuchsia-400" />
                        </span>
                        Playing preview &bull; Read Lyrics
                      </>
                    ) : (
                      "Read Lyrics"
                    )}
                  </button>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-fuchsia-500/20 group-hover:text-white"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lyrics Reader Modal */}
      {selectedSong && (
        <div
          className="animate-backdrop-in fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="lyrics-modal-title"
        >
          <div
            className="animate-modal-in relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-900/95 shadow-2xl shadow-fuchsia-950/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start gap-4 border-b border-white/10 bg-gradient-to-r from-fuchsia-500/10 via-violet-500/10 to-cyan-500/10 p-5 sm:p-6">
              {(selectedSong.album.cover_medium || selectedSong.album.cover) && (
                <img
                  src={selectedSong.album.cover_medium || selectedSong.album.cover}
                  alt={selectedSong.album.title}
                  className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-lg ring-1 ring-white/20 sm:h-20 sm:w-20"
                />
              )}
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide text-fuchsia-200 uppercase">
                  Lyrics Sheet
                </span>
                <h3
                  id="lyrics-modal-title"
                  className="mt-1.5 truncate text-xl font-bold text-white sm:text-2xl"
                >
                  {selectedSong.title}
                </h3>
                <p className="truncate text-sm text-slate-300">
                  {selectedSong.artist.name} &bull;{" "}
                  <span className="text-slate-400">{selectedSong.album.title}</span>
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={closeModal}
                aria-label="Close lyrics modal"
                className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            {/* Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-slate-950/40 px-5 py-3 sm:px-6">
              <div className="flex items-center gap-2">
                {selectedSong.preview && (
                  <button
                    type="button"
                    onClick={(e) => handleTogglePreview(e, selectedSong)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-fuchsia-400/50 hover:bg-fuchsia-500/20 hover:text-white"
                  >
                    {playingSongId === selectedSong.id ? (
                      <>
                        <span className="h-2 w-2 rounded-full bg-fuchsia-400 animate-pulse" />
                        Pause Preview
                      </>
                    ) : (
                      <>
                        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                          <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>
                        Play 30s Preview
                      </>
                    )}
                  </button>
                )}
              </div>

              {lyrics && (
                <button
                  type="button"
                  onClick={handleCopyLyrics}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-400/50 hover:bg-cyan-500/15 hover:text-white"
                >
                  {copied ? (
                    <>
                      <svg
                        className="h-3.5 w-3.5 text-emerald-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="h-3.5 w-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                      </svg>
                      Copy Lyrics
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Modal Content */}
            <div className="custom-scrollbar flex-1 overflow-y-auto p-6 sm:p-8">
              {isLoadingLyrics ? (
                <div className="space-y-3 py-4">
                  <div className="mb-4 flex items-center gap-3 text-sm font-medium text-fuchsia-300">
                    <span className="flex h-4 items-end gap-1">
                      <span className="animate-eq-1 h-4 w-1 rounded-full bg-fuchsia-400" />
                      <span className="animate-eq-2 h-4 w-1 rounded-full bg-violet-400" />
                      <span className="animate-eq-3 h-4 w-1 rounded-full bg-cyan-400" />
                    </span>
                    Fetching lyrics...
                  </div>
                  <div className="animate-shimmer h-4 w-3/4 rounded-full" />
                  <div className="animate-shimmer h-4 w-5/6 rounded-full" />
                  <div className="animate-shimmer h-4 w-2/3 rounded-full" />
                  <div className="pt-2" />
                  <div className="animate-shimmer h-4 w-4/5 rounded-full" />
                  <div className="animate-shimmer h-4 w-3/5 rounded-full" />
                  <div className="animate-shimmer h-4 w-5/6 rounded-full" />
                </div>
              ) : lyricsError ? (
                <div className="rounded-2xl border border-amber-400/25 bg-amber-500/10 p-6 text-center">
                  <p className="text-base font-semibold text-amber-200">{lyricsError}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Some tracks are missing from the free Lyrics.ovh database.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleSelectSong(selectedSong)}
                      className="cursor-pointer rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                    >
                      Try Again
                    </button>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(
                        `${selectedSong.artist.name} ${selectedSong.title} lyrics`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition hover:brightness-110"
                    >
                      Search on Google &rarr;
                    </a>
                  </div>
                </div>
              ) : (
                <div className="whitespace-pre-line text-center text-base leading-relaxed font-normal text-slate-200 sm:text-lg sm:leading-8">
                  {lyrics}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

