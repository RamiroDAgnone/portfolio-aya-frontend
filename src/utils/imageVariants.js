import { ASSETS_URL } from "../auth/constants";

export function getResponsiveImageProps({
  image,
  sizes = "100vw",
  context = "normal"
}) {
  if (!image?.sizes) return {};

  const available = Object.entries(image.sizes)
    .map(([key, val]) => {
      const width = Number(key);
      if (Number.isNaN(width) || !val?.path) return null;

      return {
        width,
        height: val.realHeight,
        ratio: val.ratio,
        path: val.path
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.width - b.width);

  if (!available.length) return {};

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

  const props = {
    src: `${ASSETS_URL}${srcCandidate.path}`,
    srcSet: available
      .map(v => `${ASSETS_URL}${v.path} ${v.width}w`)
      .join(", "),
    sizes,
    loading: "lazy",
    decoding: "async",
    width: srcCandidate.width,
    height: srcCandidate.height
  };

  return props;
}

export function getLightboxSources(image) {
  if (!image || !image.sizes) return [];

  return Object.values(image.sizes)
    .sort((a, b) => b.realWidth - a.realWidth)
    .map(size => `${ASSETS_URL}${size.path}`);
}