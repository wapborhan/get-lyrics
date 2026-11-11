export default function Footer() {
  return (
    <footer className="relative z-10 mt-auto border-t border-white/10 bg-slate-950/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-400 sm:flex-row sm:px-6">
        <p className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-gradient-to-r from-fuchsia-400 to-cyan-400 shadow-sm shadow-fuchsia-500/50" />
          <span>Get Lyrics &mdash; Powered by Lyrics.ovh</span>
        </p>
        <p>
          Developed By{" "}
          <a
            className="font-semibold text-white underline decoration-fuchsia-400/60 decoration-2 underline-offset-4 transition-colors hover:text-fuchsia-300 hover:decoration-fuchsia-300"
            href="https://www.wapborhan.com"
            target="_blank"
            rel="noreferrer"
          >
            Borhan Uddin
          </a>
        </p>
      </div>
    </footer>
  );
}
