import Image from "next/image";

// A round avatar: the uploaded photo, or the first letter of the visitor's
// first name on the dusk accent. Photos are uploaded at 256 px already, so
// Next's image optimiser is skipped.
export function Avatar({
  url,
  initial,
  size,
  className = "",
}: {
  url: string | null;
  initial: string;
  size: number;
  className?: string;
}) {
  const box = `relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full ${className}`;
  if (url) {
    return (
      <span className={box} style={{ width: size, height: size }}>
        <Image src={url} alt="" width={size} height={size} unoptimized className="size-full object-cover" />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className={`${box} bg-dusk font-heading font-semibold text-night`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initial}
    </span>
  );
}
