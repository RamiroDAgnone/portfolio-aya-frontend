import { useState } from "react";
import { getResponsiveImageProps } from "../../utils/imageVariants";
import { getScrapPinVariant, getScrapTapeVariant } from "../../utils/getScrapVariant";

import Lightbox from "../../components/lightbox/Lightbox";

export default function ProyectoB({
  title,
  index,
  author,
  description,
  graphics = [],
  reverse = false,
}) {
  const [lightboxData, setLightboxData] = useState(null);
  const [mobileOverlay, setMobileOverlay] = useState(false);

  const AUTHOR_LABELS = {
    autor1: "Ana Montesino",
    autor2: "Agustina Lubris"
  };

  const pinClass = getScrapPinVariant(index);
  const tapeClass = getScrapTapeVariant(index);

  const mainImage = graphics[0];

  return (
    <>
      <article className={`proyectoB ${reverse ? "proyectoB-reverse" : ""} `}>
        <div className={`proyectoB-visual scrap-base scrap-pin-top ${pinClass}`}>
          <div className="proyectoB-image">
            <div className="proyectoB-imageInner">
              {mainImage && mainImage.sizes && (() => {
                const baseSize =
                  mainImage.sizes?.[600] || Object.values(mainImage.sizes)[0];

                return (
                  <div className={`scrap-base scrap-tape-corners ${tapeClass}`}>
                    <div className={` proyectoB-imgWrap`}>
                      <img
                        {...getResponsiveImageProps({
                          image: mainImage,
                          sizes: "(max-width: 768px) 95vw, 1200px"
                        })}
                        width={baseSize.realWidth}
                        height={baseSize.realHeight}
                        style={{
                          aspectRatio: `${baseSize.realWidth} / ${baseSize.realHeight}`
                        }}
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
                      
                      <div
                        className={`proyectoB-overlay ${
                          mobileOverlay ? "active-mobile" : ""
                        }`}
                        onClick={() => {
                          if (window.innerWidth < 768) {
                            setMobileOverlay(!mobileOverlay);
                          } else {
                            setLightboxData({
                              images: graphics,
                              index: 0
                            });
                          }
                        }}
                      >
                        <h4>{title}</h4>
                        <span>Ver galería</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>
            
          </div>
          <span className="proyectoB-divider"></span>
          <div className="proyectoB-content">
            <h3 className="proyectoB-title">{title}</h3>
            <span>{AUTHOR_LABELS[author]}</span>
            <p className="proyectoB-text">{description}</p>
          </div>
        </div>
      </article>

      {lightboxData && (
        <Lightbox
          images={lightboxData.images}
          startIndex={lightboxData.index}
          onClose={() => setLightboxData(null)}
        />
      )}
    </>
  );
}
