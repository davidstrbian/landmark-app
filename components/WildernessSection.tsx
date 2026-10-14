// Sits between Finnish Fells and National Parks. Its background fades from the
// fells' grey into the page's off-white (see .bg-haze-fade in globals.css).
// No wilderness areas have been added yet.
export function WildernessSection() {
  return (
    <section
      id="wilderness"
      aria-labelledby="wilderness-heading"
      className="bg-haze-fade py-24 text-mist-ink sm:py-32"
    >
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* Same size as the Finnish Fells heading. */}
        <h2
          id="wilderness-heading"
          className="font-heading text-[clamp(1.5rem,2.35vw,2.75rem)] font-medium leading-tight tracking-tight"
        >
          Wilderness Areas
        </h2>
        <p className="mt-3 font-body text-sm text-mist-ink/70">Coming soon.</p>
      </div>
    </section>
  );
}
