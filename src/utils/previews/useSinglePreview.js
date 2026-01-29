import { useEffect, useRef, useState } from "react";
import { ASSETS_URL } from "../../auth/constants";
import { getPreviewSrc } from "./imagePreview";

export function useSinglePreview(item, size = 600) {
  const [preview, setPreview] = useState(null);
  const metaRef = useRef(null);
  const prevUrlRef = useRef(null);

  const computeMeta = it => {
    if (!it) return null;
    if (it.file && it.file instanceof Blob) {
      return `file:${it.file.size}-${it.file.type}-${it.file.lastModified || 0}`;
    }
    if (it.current && (it.current.path || it.current.sizes)) {
      return it.current.path ? `backend:${it.current.path}` : `backend-sizes:${Object.keys(it.current.sizes).join(",")}`;
    }
    if (typeof it === "string") return `url:${it}`;
    return JSON.stringify({ id: it?.id ?? null });
  };

  useEffect(() => {
    let active = true;
    const meta = computeMeta(item);

    if (meta === metaRef.current && prevUrlRef.current !== null) {
      // no change
      setPreview(prevUrlRef.current);
      return;
    }

    metaRef.current = meta;

    (async () => {
      try {
        const input = item && item.file ? item.file : item;
        const src = await getPreviewSrc(input, size, ASSETS_URL);
        if (!active) {
          // cleanup newly created blob if unmounted
          if (typeof src === "string" && src.startsWith("blob:")) {
            try { URL.revokeObjectURL(src); } catch {}
          }
          return;
        }

        // revoke previous blob url if distinto
        const prev = prevUrlRef.current;
        if (prev && prev !== src && typeof prev === "string" && prev.startsWith("blob:")) {
          try { URL.revokeObjectURL(prev); } catch {}
        }

        prevUrlRef.current = src ?? null;
        setPreview(src ?? null);
      } catch (err) {
        setPreview(null);
      }
    })();

    return () => {
      active = false;
    };
  }, [item, size]);

  // on unmount revoke
  useEffect(() => {
    return () => {
      const prev = prevUrlRef.current;
      if (prev && typeof prev === "string" && prev.startsWith("blob:")) {
        try { URL.revokeObjectURL(prev); } catch {}
      }
      prevUrlRef.current = null;
    };
  }, []);

  return preview;
}
