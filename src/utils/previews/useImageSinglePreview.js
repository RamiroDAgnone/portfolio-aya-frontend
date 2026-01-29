import { useEffect, useRef, useState } from "react";
import { getPreviewSrc } from "./imagePreview";
import { ASSETS_URL } from "../../auth/constants";

export function useImageSinglePreview({ file, current }) {
  const [preview, setPreview] = useState(null);
  const prevRef = useRef(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const source = file ?? current ?? null;
      const src = source
        ? await getPreviewSrc(source, 600, ASSETS_URL)
        : null;

      if (!active) return;

      const prev = prevRef.current;
      if (
        typeof prev === "string" &&
        prev.startsWith("blob:") &&
        prev !== src
      ) {
        URL.revokeObjectURL(prev);
      }

      prevRef.current = src;
      setPreview(src);
    };

    load();

    return () => {
      active = false;
      const prev = prevRef.current;
      if (typeof prev === "string" && prev.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
    };
  }, [file, current]);

  return preview;
}