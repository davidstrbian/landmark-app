import { Header } from "@/components/Header";

// Sign-in pages and the account page: the header over a night band, as on the
// map page, with the page's card centred below.
export default function AuthLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-dvh flex-col bg-night">
      <Header />
      <div aria-hidden="true" className="h-20 shrink-0" />
      <main className="flex flex-1 items-start justify-center px-4 pt-6 pb-16 sm:items-center sm:pt-0">
        {children}
      </main>
    </div>
  );
}
