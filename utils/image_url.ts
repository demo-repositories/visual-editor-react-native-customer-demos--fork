import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";
import { client } from "../sanity/client";

const builder = createImageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  if (!source) return null;
  try {
    return builder.image(source);
  } catch (error) {
    console.error(error);
    return null;
  }
}

/**
 * Resolve a usable image URL from a Sanity image projection.
 * Prefers the image-url builder (needs an asset ref so we can request a width),
 * and falls back to a pre-resolved `url` field when the builder can't be used.
 */
export function getImageUrl(source: any, width?: number): string | null {
  if (!source) return null;
  const b = urlFor(source as SanityImageSource);
  if (b) {
    try {
      return width ? b.width(width).url() : b.url();
    } catch {
      // fall through to the resolved url below
    }
  }
  return source?.url ?? source?.asset?.url ?? null;
}
