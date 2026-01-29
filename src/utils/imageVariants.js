import { ASSETS_URL } from "../auth/constants";

export function getResponsiveImageProps({
  image,
  sizes = "100vw",
  context = "normal"
}) {
  if (!image || !image.sizes) {
    throw new Error("image con sizes es requerido");
  }

  const available = Object.entries(image.sizes)
    .map(([key, val]) => ({
      width: Number(key),
      path: val.path
    }))
    .filter(v => !Number.isNaN(v.width))
    .sort((a, b) => a.width - b.width);

  if (!available.length) {
    throw new Error("No hay tamaños disponibles");
  }

  let targetWidth;

  switch (context) {
    case "decoration":
      targetWidth = 600;
      break;
    case "lightbox":
      targetWidth = Infinity;
      break;
    default: {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      targetWidth = isMobile ? 600 : 1200;
    }
  }

  const srcCandidate =
    available.find(v => v.width >= targetWidth) ||
    available[available.length - 1];

  return {
    src: `${ASSETS_URL}${srcCandidate.path}`,
    srcSet: available
      .map(v => `${ASSETS_URL}${v.path} ${v.width}w`)
      .join(", "),
    sizes,
    loading: "lazy",
    decoding: "async"
  };
}

export function getLightboxSources(image) {
  if (!image || !image.sizes) return [];

  return Object.values(image.sizes)
    .sort((a, b) => b.realWidth - a.realWidth)
    .map(size => `${ASSETS_URL}${size.path}`);
}