import Image from "next/image";
import heroImage from "@/public/images/hero.jpg";

// Full-width opening banner with a fixed 1585×685 shape at every screen
// width; the photo is cropped to fill it. On narrow screens a minimum height
// keeps the text clear of the header. The header overlays its top edge.
export function Hero() {
  return (
    <section
      className="relative isolate flex aspect-[1585/685] min-h-[26rem] w-full items-center justify-center overflow-hidden px-6 text-center text-white"
    >
      <Image
        src={heroImage}
        alt=""
        fill
        preload
        placeholder="blur"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      {/* Darkens the photo so the white text stays readable. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-black/45" />

      <div>
        {/* Wide windows (aspect ratio 3:2 or wider) fit the heading on one
            line; narrower windows break it after "Your". Font sizes scale with
            the window width, like the image does. */}
        <h1 className="font-heading text-[clamp(2.5rem,8vw,5rem)] font-medium leading-[1.05] tracking-tight wide:whitespace-nowrap wide:text-[clamp(2.5rem,6vw,7rem)]">
          Remember Your
          <br className="wide:hidden" /> Adventures
        </h1>
        <p className="mx-auto mt-5 max-w-md font-heading text-[clamp(1.125rem,1.5vw,1.5rem)] text-white/90 text-pretty wide:max-w-none">
          The tool you need for tracking your wildest achievements
        </p>
      </div>
    </section>
  );
}
