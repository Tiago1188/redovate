/**
 * Resolves image URLs, handling both Cloudinary and external URLs
 */
export function resolveImageUrl(
  url: string | undefined | null,
  options?: ImageOptions
): string {
  if (!url) {
    return getPlaceholderImage(options?.type);
  }

  // If it's already a full URL, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // If it's a Cloudinary public ID, construct the URL
  if (process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return buildCloudinaryUrl(url, options);
  }

  return url;
}

interface ImageOptions {
  width?: number;
  height?: number;
  quality?: number;
  type?: "logo" | "hero" | "gallery" | "favicon";
}

function buildCloudinaryUrl(publicId: string, options?: ImageOptions): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  const transforms: string[] = [];

  if (options?.width) {
    transforms.push(`w_${options.width}`);
  }
  if (options?.height) {
    transforms.push(`h_${options.height}`);
  }
  if (options?.quality) {
    transforms.push(`q_${options.quality}`);
  }

  // Auto format and quality for optimal delivery
  transforms.push("f_auto", "q_auto");

  const transformString = transforms.length > 0 ? transforms.join(",") + "/" : "";

  return `${baseUrl}/${transformString}${publicId}`;
}

function getPlaceholderImage(type?: ImageOptions["type"]): string {
  switch (type) {
    case "logo":
      return "/placeholder-logo.svg";
    case "hero":
      return "/placeholder-hero.jpg";
    case "favicon":
      return "/favicon.ico";
    case "gallery":
    default:
      return "/placeholder-image.jpg";
  }
}

/**
 * Gets optimized dimensions for different image types
 */
export function getImageDimensions(type: ImageOptions["type"]): {
  width: number;
  height: number;
} {
  switch (type) {
    case "logo":
      return { width: 200, height: 60 };
    case "hero":
      return { width: 1920, height: 1080 };
    case "favicon":
      return { width: 32, height: 32 };
    case "gallery":
    default:
      return { width: 800, height: 600 };
  }
}

