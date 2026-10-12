import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { getLandmarks } from "@/lib/landmarks";
import { Tracker } from "./tracker";

export default async function Home() {
  const landmarks = await getLandmarks();

  return (
    <>
      <Header />
      <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-5 pt-14 sm:px-8 sm:pt-20">
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-primary">Finland · V0.1</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.08] tracking-tight text-balance sm:text-6xl">
            Explore Finland, one landmark at a time.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted text-pretty">
            From Halti on the Norwegian border to the islands of the
            Archipelago Sea, keep track of the fells, national parks and
            natural sights you&apos;ve visited.
          </p>
        </div>
        <Tracker landmarks={landmarks} />
      </main>
      <Footer />
    </>
  );
}
