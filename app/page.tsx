import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { getLandmarks } from "@/lib/landmarks";
import { Tracker } from "./tracker";

// Landmarks load from Supabase (when configured) at build time; the page is
// regenerated at most once an hour so edits in the database show up.
export const revalidate = 3600;

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
