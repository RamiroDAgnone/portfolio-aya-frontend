import { useEffect, useRef, useState } from "react";
import { ASSETS_URL } from "../../auth/constants";
import { getPreviewSrc } from "./imagePreview";

export function useImageArrayPreview(items = []) {
  const [previews, setPreviews] = useState({});
  const previousRef = useRef({});

  useEffect(() => {
    let active = true;

    const load = async () => {
      const list = items || [];
      const tasks = list.map((item, idx) => {
        const id = item?.id ?? `idx-${idx}`;
        return getPreviewSrc(item, 600, ASSETS_URL)
          .then(src => ({ id, src: src ?? null }))
          .catch(() => ({ id, src: null }));
      });

      const results = await Promise.allSettled(tasks);

      if (!active) return;

      const next = {};
      for (const r of results) {
        if (r.status === "fulfilled") {
          const { id, src } = r.value;
          next[id] = src;
        } else {
          
        }
      }

      // cleanup blobs viejos
      for (const id in previousRef.current) {
        const prev = previousRef.current[id];
        const nextUrl = next[id];
        if (
          typeof prev === "string" &&
          prev.startsWith("blob:") &&
          prev !== nextUrl
        ) {
          try { URL.revokeObjectURL(prev); } catch {}
        }
      }

      previousRef.current = next;
      setPreviews(next);
    };

    load();

    return () => {
      active = false;
      for (const id in previousRef.current) {
        const url = previousRef.current[id];
        if (typeof url === "string" && url.startsWith("blob:")) {
          try { URL.revokeObjectURL(url); } catch {}
        }
      }
      previousRef.current = {};
    };
  }, [items]);

  return previews;
}