import PeakChecklist from "./peak-checklist";

export default function Home() {
  return (
    <main className="relative flex-1 overflow-hidden">
      <div
        aria-hidden="true"
        className="contours pointer-events-none absolute inset-x-0 top-0 h-[28rem]"
      />
      <div className="relative mx-auto w-full max-w-3xl px-6 pb-24 pt-16 sm:pt-24">
        <header className="mb-12 sm:mb-16">
          <p className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Landmark Tracker · Suomi
          </p>
          <h1 className="font-serif text-5xl font-medium leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Five fells, one summit at a time.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted text-pretty">
            Track the peaks, trails and adventures you&apos;ve earned across
            Finland. Start with the icons — from the roof of the country to the
            hills of Karelia.
          </p>
        </header>
        <PeakChecklist />
      </div>
    </main>
  );
}
