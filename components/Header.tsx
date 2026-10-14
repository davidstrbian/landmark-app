import Link from "next/link";

export function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 bg-transparent text-white">
      <div className="flex h-20 w-full items-center px-6 sm:px-12">
        <Link
          href="/"
          className="rounded-lg font-heading text-2xl font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Sokosti
        </Link>
      </div>
    </header>
  );
}
