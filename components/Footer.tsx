export function Footer() {
  return (
    <footer id="about" className="mt-24 border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">About</h2>
          <p className="mt-3 max-w-prose leading-relaxed text-muted">
            Landmark Tracker is a simple checklist of Finland&apos;s fells,
            national parks and natural sights. Open a landmark to learn about
            it, then mark it conquered or visited. For now your progress is
            saved in this browser, with or without an account.
          </p>
        </div>
        <div className="text-sm text-muted">
          <p className="font-medium text-foreground">Made in Finland 🇫🇮</p>
          <p className="mt-3 leading-relaxed">
            Facts from Metsähallitus (luontoon.fi) and Wikipedia. Photo credits
            appear with each landmark.
          </p>
          <a
            href="https://github.com/davidstrbian/landmark-app"
            className="mt-3 inline-block rounded font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
