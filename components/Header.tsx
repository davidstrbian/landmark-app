import Link from "next/link";

export function Header() {
  return (
    <header className="bg-transparent">
      <div className="flex h-20 w-full items-center px-6 sm:px-12">
        <Link
          href="/"
          className="rounded-lg font-heading text-2xl font-medium tracking-tight focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Sokosti
        </Link>
      </div>
    </header>
  );
}
