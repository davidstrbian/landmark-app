import Image from "next/image";
import heroImage from "@/public/images/hero.jpg";

// Full-bleed opening screen. The header overlays its top edge.
export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh items-center justify-center overflow-hidden px-6 text-center text-white">
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

      <div className="max-w-3xl">
        <h1 className="font-heading text-5xl font-medium leading-[1.05] tracking-tight text-balance sm:text-7xl">
          Remember Your Adventures
        </h1>
        <p className="mx-auto mt-5 max-w-md font-heading text-lg text-white/90 text-pretty sm:text-xl">
          The tool you need for tracking your wildest achievements
        </p>
      </div>
    </section>
  );
}
