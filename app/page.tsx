import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { getLandmarks } from "@/lib/landmarks";
import { Tracker } from "./tracker";

export default async function Home() {
  const landmarks = await getLandmarks();

  return (
    <>
      <Header />
      <Hero />
      <main id="top" className="mx-auto w-full max-w-6xl flex-1 px-5 pt-6 sm:px-8 sm:pt-10">
        <Tracker landmarks={landmarks} />
      </main>
      <Footer />
    </>
  );
}
