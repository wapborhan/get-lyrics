import { useCallback, useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Lyrics from "./Lyrics";
import type { Song, SuggestResponse } from "./types";

const QUICK_SUGGESTIONS = [
  "Bohemian Rhapsody",
  "Blinding Lights",
  "Shape of You",
  "Hotel California",
  "Starboy",
];

export default function App() {
  const [search, setSearch] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [songs, setSongs] = useState<Song[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const searchLyrics = useCallback(async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query) {
      setError("Please enter a song title or artist name to search.");
      inputRef.current?.focus();
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(null);
    setSubmittedQuery(query);

    try {
      const response = await fetch(
        `https://api.lyrics.ovh/suggest/${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = (await response.json()) as SuggestResponse;
      setSongs(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return;
      }
      setError("Unable to reach the lyrics server right now. Please try again.");
      setSongs(null);
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    searchLyrics(search);
  };

  const handleQuickSearch = useCallback(
    (query: string) => {
      setSearch(query);
      searchLyrics(query);
    },
    [searchLyrics]
  );

  const handleReset = useCallback(() => {
    abortRef.current?.abort();
    setSearch("");
    setSubmittedQuery("");
    setSongs(null);
    setError(null);
    setIsLoading(false);
    inputRef.current?.focus();
  }, []);

  const hasResults = songs !== null;

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-slate-950 text-slate-100">
      {/* Animated ambient neon background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="animate-float-slow absolute -top-36 -left-24 h-[28rem] w-[28rem] rounded-full bg-fuchsia-600/20 blur-[120px]" />
        <div className="animate-float-reverse absolute top-1/3 -right-28 h-[30rem] w-[30rem] rounded-full bg-cyan-500/15 blur-[130px]" />
        <div className="animate-float-slow absolute -bottom-32 left-1/3 h-[26rem] w-[26rem] rounded-full bg-violet-600/20 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.8) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <Header onReset={handleReset} onQuickSearch={handleQuickSearch} />

      <main className="relative z-10 flex flex-1 flex-col">
        {/* Hero + Search Section */}
        <section
          className={`mx-auto flex w-full max-w-4xl flex-col items-center px-4 text-center transition-all duration-500 sm:px-6 ${
            hasResults || isLoading ? "pt-10 pb-8 sm:pt-12" : "my-auto py-16 sm:py-24"
          }`}
        >
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-fuchsia-200 shadow-lg shadow-fuchsia-500/10 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fuchsia-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-fuchsia-400" />
            </span>
            Instant Lyrics &amp; Audio Preview Explorer
          </div>

          <h1 className="animate-fade-up mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Find Every{" "}
            <span className="bg-gradient-to-r from-fuchsia-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
              Lyric &amp; Beat
            </span>{" "}
            in Seconds
          </h1>

          <p className="animate-fade-up mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Search millions of tracks by song title or artist name. Listen to 30-second previews and
            open full, formatted lyrics in a sleek distraction-free reader.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSubmit}
            className="animate-fade-up mt-8 w-full max-w-2xl"
            role="search"
          >
            <div className="group relative flex flex-col gap-2.5 rounded-2xl border border-white/15 bg-white/[0.06] p-2 shadow-2xl shadow-fuchsia-950/30 backdrop-blur-xl transition-all duration-300 focus-within:border-fuchsia-400/60 focus-within:bg-white/[0.09] focus-within:shadow-fuchsia-500/20 sm:flex-row sm:items-center sm:rounded-full sm:p-2">
              <div className="relative flex flex-1 items-center">
                <svg
                  className="pointer-events-none ml-3.5 h-5 w-5 shrink-0 text-slate-400 transition-colors group-focus-within:text-fuchsia-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search a song, artist, or lyric..."
                  aria-label="Search for a song or artist"
                  className="w-full bg-transparent px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none sm:text-base"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      inputRef.current?.focus();
                    }}
                    aria-label="Clear search query"
                    className="mr-1 inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
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
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-500/25 transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-65 sm:rounded-full"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Searching...
                  </>
                ) : (
                  <>
                    <span>Search</span>
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
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Suggestion Pills */}
          <div className="animate-fade-up mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-medium text-slate-400">Try:</span>
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleQuickSearch(suggestion)}
                className="cursor-pointer rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-300 transition-all hover:-translate-y-0.5 hover:border-fuchsia-400/40 hover:bg-fuchsia-500/15 hover:text-white"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Error Alert */}
          {error && (
            <div
              role="alert"
              className="animate-fade-up mt-6 flex w-full max-w-2xl items-center justify-between gap-3 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-left text-sm text-rose-200 backdrop-blur-md"
            >
              <span>{error}</span>
              {submittedQuery && (
                <button
                  type="button"
                  onClick={() => searchLyrics(submittedQuery)}
                  className="shrink-0 cursor-pointer rounded-full border border-rose-300/30 bg-rose-500/20 px-3 py-1 text-xs font-semibold text-white transition hover:bg-rose-500/30"
                >
                  Retry
                </button>
              )}
            </div>
          )}
        </section>

        {/* Loading Skeleton Grid */}
        {isLoading && (
          <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6" aria-label="Loading tracks">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                >
                  <div className="animate-shimmer aspect-[4/3] w-full" />
                  <div className="space-y-3 p-5">
                    <div className="animate-shimmer h-5 w-3/4 rounded-full" />
                    <div className="animate-shimmer h-4 w-1/2 rounded-full" />
                    <div className="animate-shimmer h-3.5 w-2/3 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty Results State */}
        {!isLoading && songs !== null && songs.length === 0 && (
          <section className="mx-auto w-full max-w-xl px-4 pb-16 text-center">
            <div className="animate-fade-up rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-fuchsia-300">
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 18V5l12-2v13" />
                  <circle cx="6" cy="18" r="3" />
                  <circle cx="18" cy="16" r="3" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-bold text-white">No tracks matched &ldquo;{submittedQuery}&rdquo;</h2>
              <p className="mt-2 text-sm text-slate-400">
                Try checking the spelling or searching with just the artist name or a shorter song title.
              </p>
            </div>
          </section>
        )}

        {/* Results Grid */}
        {!isLoading && songs !== null && songs.length > 0 && (
          <Lyrics songs={songs} searchQuery={submittedQuery} />
        )}
      </main>

      <Footer />
    </div>
  );
}
