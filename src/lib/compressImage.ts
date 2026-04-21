/**
 * Compress an image to JPEG on the client to keep uploads fast + small.
 * - Skips if the browser can't decode the file (returns original)
 * - Resizes so the longest side is at most `maxDim` pixels
 * - Encodes as JPEG at `quality` (0–1)
 * - Preserves orientation via browser auto-rotate
 */
export async function compressImage(
  file: File,
  opts: { maxDim?: number; quality?: number; mimeType?: string } = {}
): Promise<File> {
  const { maxDim = 1600, quality = 0.82, mimeType = "image/jpeg" } = opts;

  if (!file.type.startsWith("image/")) return file;

  // Already small + already a supported format? Skip work.
  if (file.size < 300 * 1024 && /jpeg|jpg|webp/i.test(file.type)) return file;

  try {
    const bitmap = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * scale);
    const h = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);

    const blob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob(resolve, mimeType, quality)
    );
    bitmap.close?.();
    if (!blob) return file;

    if (blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], newName, {
      type: mimeType,
      lastModified: Date.now(),
    });
  } catch {
    return file;
  }
}
