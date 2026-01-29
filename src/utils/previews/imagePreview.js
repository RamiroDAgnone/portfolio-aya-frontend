import { ASSETS_URL } from "../../auth/constants";

const isBlob = v => v instanceof Blob;
const isObject = v => v && typeof v === "object";

const joinUrl = (base = "", path = "") => {
  if (!base) return path || null;
  if (!path) return base || null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${String(base).replace(/\/+$/, "")}/${String(path).replace(/^\/+/, "")}`;
};

const pickSizeObject = (sizes = {}, pref = 600) => {
  if (!sizes || typeof sizes !== "object") return null;

  if (sizes[pref]) return sizes[pref];
  if (sizes[1200]) return sizes[1200];

  const entries = Object.entries(sizes)
    .map(([k, v]) => ({ key: Number(k), val: v }))
    .filter(x => !Number.isNaN(x.key))
    .sort((a, b) => a.key - b.key);

  if (entries.length === 0) {
    const first = Object.values(sizes).find(s => s && s.path);
    return first || null;
  }

  const cand = entries.find(e => e.key >= pref);
  return (cand && cand.val) || entries[entries.length - 1].val;
};

export const getImageSrc = (image, size = 600, assetsUrl = ASSETS_URL) => {
  if (!image) return null;

  if (image.sizes) {
    const chosen = pickSizeObject(image.sizes, size);
    if (!chosen?.path) return null;
    return joinUrl(assetsUrl, chosen.path);
  }

  if (image.path) {
    return joinUrl(assetsUrl, `${image.path}/${size}`);
  }

  return null;
};

export async function createDownscaledPreview(file, maxWidth = 300, quality = 0.5) {
  if (!isBlob(file)) return null;

  return new Promise(resolve => {
    const tmpUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const ratio = img.width ? Math.min(1, maxWidth / img.width) : 1;
        const width = Math.max(1, Math.round(img.width * ratio));
        const height = Math.max(1, Math.round(img.height * ratio));

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL("image/jpeg", quality);

        resolve(dataUrl);
      } catch (err) {
        resolve(tmpUrl);
      } finally {
        try { URL.revokeObjectURL(tmpUrl); } catch {}
      }
    };

    img.onerror = () => {
      try { URL.revokeObjectURL(tmpUrl); } catch {}
      resolve(null);
    };

    img.src = tmpUrl;
  });
}

// getPreviewSrc(input, size = 600, assetsUrl = ASSETS_URL)
export async function getPreviewSrc(input, size = 600, assetsUrl = ASSETS_URL) {
  if (!input) return null;

  // Blob/File
  if (isBlob(input)) {
    return await createDownscaledPreview(input, size);
  }

  // string URL
  if (typeof input === "string") {
    return input;
  }

  // priorizar file
  if (isObject(input)) {
    const file = input.file ?? null;
    if (isBlob(file)) {
      return await createDownscaledPreview(file, size);
    }

    // caso imagen completa
    if (input.sizes) {
      return getImageSrc(input, size, assetsUrl);
    }

    // varios formatos anidados: current, current.image, image
    const backendImage =
      (input.current && input.current.sizes) ? input.current :
      (input.current && input.current.image && input.current.image.sizes) ? input.current.image :
      (input.image && input.image.sizes) ? input.image :
      null;

    if (backendImage) {
      return getImageSrc(backendImage, size, assetsUrl);
    }

    // current puede ser string url
    if (typeof input.current === "string") {
      return input.current;
    }

    return null;
  }

  return null;
}