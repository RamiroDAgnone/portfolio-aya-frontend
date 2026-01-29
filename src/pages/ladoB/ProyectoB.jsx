import { useState } from "react";
import { getResponsiveImageProps } from "../../utils/imageVariants";

import Lightbox from "../../components/lightbox/Lightbox";

export default function ProyectoB({
  title,
  author,
  description,
  graphics = [],
  reverse = false
}) {
  const [lightboxData, setLightboxData] = useState(null);

  const AUTHOR_LABELS = {
    autor1: "Ana Montesino",
    autor2: "Agustina Lubris"
  };

  const mainImage = graphics[0];

  return (
    <article className={`proyectoB ${reverse ? "proyectoB-reverse" : ""}`}>
      <div className="proyectoB-image">
        <div className="proyectoB-imageInner">
          {mainImage && mainImage.sizes && (
            <img
              {...getResponsiveImageProps({
                image: mainImage,
                sizes: "(max-width: 768px) 95vw, 1200px"
              })}
              loading="lazy"
              decoding="async"
              alt={title}
              onClick={() =>
                setLightboxData({
                  images: graphics,
                  index: 0
                })
              }
            />
          )}
        </div>
      </div>

      <div className="proyectoB-content">
        <h3 className="proyectoB-title">{title}</h3>
        <span>{AUTHOR_LABELS[author]}</span>
        <p className="proyectoB-text">{description}</p>
      </div>

      {lightboxData && (
        <Lightbox
          images={lightboxData.images}
          startIndex={lightboxData.index}
          onClose={() => setLightboxData(null)}
        />
      )}
    </article>
  );
}
