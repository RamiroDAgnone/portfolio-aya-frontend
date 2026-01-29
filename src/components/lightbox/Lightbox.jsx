import { useEffect, useState } from "react";
import { getLightboxSources } from "../../utils/imageVariants";

import "./Lightbox.css";

export default function Lightbox({ images, startIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;

        case "ArrowRight":
          setCurrentIndex((i) =>
            i < images.length - 1 ? i + 1 : i
          );
          break;

        case "ArrowLeft":
          setCurrentIndex((i) =>
            i > 0 ? i - 1 : i
          );
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose, images.length]);


  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartX - touchEndX;

    const SWIPE_THRESHOLD = 50;

    if (deltaX > SWIPE_THRESHOLD && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    if (deltaX < -SWIPE_THRESHOLD && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }

    setTouchStartX(null);
  };

  if (!images || images.length === 0) return null;

  const currentItem = images[currentIndex];
  const currentImage = getLightboxSources(currentItem)[0];
  const description =
    typeof currentItem?.description === "string" &&
    currentItem.description.trim().length > 0
      ? currentItem.description
      : null;


  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-image-wrapper">
          <img
            src={currentImage}
            className="lightbox-image"
            alt=""
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        </div>

        <div className="lightbox-description">
          {description || ""}
        </div>
        
        {images.length > 1 && (
          <>
            <button
              className="lightbox-arrow lightbox-arrow-left"
              disabled={currentIndex === 0}
              onClick={() =>
                setCurrentIndex((i) => (i > 0 ? i - 1 : i))
              }
              aria-label="Imagen anterior"
            >
              ‹
            </button>

            <div className="lightbox-thumbs">
              {images.map((img, i) => {
                const thumb = getLightboxSources(img)[0];

                return (
                  <div
                    key={i}
                    className={`lightbox-thumb ${i === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(i)}
                  >
                    <img src={thumb} alt="" />
                  </div>
                );
              })}
            </div>

            <button
              className="lightbox-arrow lightbox-arrow-right"
              disabled={currentIndex === images.length - 1}
              onClick={() =>
                setCurrentIndex((i) =>
                  i < images.length - 1 ? i + 1 : i
                )
              }
              aria-label="Imagen siguiente"
            >
              ›
            </button>
          </>
        )}

        <button className="lightbox-close" onClick={onClose}>
          x
        </button>

      </div>
    </div>
  );
}