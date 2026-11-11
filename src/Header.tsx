import { useState } from "react";

interface HeaderProps {
  onReset: () => void;
  onQuickSearch: (query: string) => void;
}

const POPULAR_LINKS = [
  { label: "Top Pop", query: "Blinding Lights" },
  { label: "Classic Rock", query: "Bohemian Rhapsody" },
  { label: "Chill Vibes", query: "Starboy" },
];

export default function Header({ onReset, onQuickSearch }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleBrandClick = () => {
    setMenuOpen(false);
    onReset();
  };

  const handleQuickPick = (query: string) => {
    setMenuOpen(false);
    onQuickSearch(query);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <button
          type="button"
          onClick={handleBrandClick}
          className="group flex cursor-pointer items-center gap-3 text-left focus:outline-none"
        >
          <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-violet-500 to-cyan-400 p-[1px] shadow-lg shadow-fuchsia-500/25 transition-transform duration-300 group-hover:scale-105">
            <span className="flex h-full w-full items-center justify-center gap-0.5 rounded-[11px] bg-slate-950/90 px-2">
              <span className="animate-eq-1 h-4 w-1 rounded-full bg-fuchsia-400" />
              <span className="animate-eq-2 h-5 w-1 rounded-full bg-violet-400" />
              <span className="animate-eq-3 h-3.5 w-1 rounded-full bg-cyan-400" />
            </span>
          </span>
          <div>
            <span className="block bg-gradient-to-r from-white via-fuchsia-200 to-cyan-200 bg-clip-text text-lg font-bold tracking-tight text-transparent">
              Get Lyrics
            </span>
            <span className="block text-[11px] font-medium tracking-wider text-slate-400 uppercase">
              Music &amp; Lyrics Finder
            </span>
          </div>
        </button>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Main navigation"
        >
          <button
            type="button"
            onClick={handleBrandClick}
            className="cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
          >
            Home
          </button>
          {POPULAR_LINKS.map((item) => (
            <button
              key={item.query}
              type="button"
              onClick={() => handleQuickPick(item.query)}
              className="cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle navigation menu"
          className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10 md:hidden"
        >
          {menuOpen ? (
            <svg
              className="h-5 w-5"
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
          ) : (
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="4" x2="20" y1="7" y2="7" />
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="17" y2="17" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile collapsible navigation */}
      <div
        id="mobile-nav"
        className={`grid overflow-hidden transition-all duration-300 ease-out md:hidden ${
          menuOpen
            ? "grid-rows-[1fr] border-t border-white/10 opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 space-y-1 px-4 py-3">
          <button
            type="button"
            onClick={handleBrandClick}
            className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-200 transition hover:bg-white/10"
          >
            Home
          </button>
          {POPULAR_LINKS.map((item) => (
            <button
              key={item.query}
              type="button"
              onClick={() => handleQuickPick(item.query)}
              className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
