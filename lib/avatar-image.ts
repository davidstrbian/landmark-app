import { AVATAR_SIZE_PX } from "./auth-form";

export type PixelArea = { x: number; y: number; width: number; height: number };

// Draws the chosen square of the picture at 256 px and encodes it as WebP,
// or JPEG where the browser can't encode WebP.
export async function cropToBlob(src: string, area: PixelArea): Promise<Blob> {
  const image = new Image();
  image.src = src;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = AVATAR_SIZE_PX;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("no canvas");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, AVATAR_SIZE_PX, AVATAR_SIZE_PX);
  const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.88));
  const webp = await encode("image/webp");
  if (webp?.type === "image/webp") return webp;
  const jpeg = await encode("image/jpeg");
  if (!jpeg) throw new Error("encode failed");
  return jpeg;
}
