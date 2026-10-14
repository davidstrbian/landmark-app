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
      <main id="top" className="flex-1">
        <Tracker landmarks={landmarks} />
      </main>
      <Footer />
    </>
  );
}
