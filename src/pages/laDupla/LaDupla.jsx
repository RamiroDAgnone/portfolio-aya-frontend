import { useEffect, useState } from "react";
import { API_URL } from "../../auth/constants";
import { getResponsiveImageProps } from "../../utils/imageVariants";

import Lightbox from "../../components/lightbox/Lightbox";
import UnaDupla from "./UnaDupla";

import "./LaDupla.css";
import "../../components/css/Scrapbook.css"

let teamCache = null;

export default function LaDupla({ page }) {
  const [dupla, setDupla] = useState([]);
  const [lightboxData, setLightboxData] = useState(null);

  useEffect(() => {
    if (teamCache) {
      setDupla(teamCache);
      return;
    }

    fetch(`${API_URL}/team`)
      .then(res => res.json())
      .then(data => {
        teamCache = data;
        setDupla(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="about-container" 
      style= {{ 
        "--bg-color": page.backgroundColor, 
        "--line-color": page.linesColor?.length === 7 ? page.linesColor + "B3" : page.linesColor
      }} 
    >
      <div className="dupla-container">
        <div className="dupla-layout">
          <div className="dupla-desc scrap-base scrap-tape-corners">
            <h1>{page.title}</h1>
            {page.description?.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
            ))}
          </div>
          {page.graphics?.map((img, i) => {
            const baseSize = img.sizes[600] || Object.values(img.sizes)[0];

            return (
              <div key={i} className={`dupla-img dupla-${i + 1}`}>
                <img
                  className="dupla-photo"
                  {...getResponsiveImageProps({
                    image: img,
                    sizes: "(max-width: 768px) 90vw, 420px"
                  })}
                  width={baseSize.realWidth}
                  height={baseSize.realHeight}
                  style={{
                    aspectRatio: `${baseSize.realWidth} / ${baseSize.realHeight}`
                  }}
                  loading="lazy"
                  decoding="async"
                  alt={page.title}
                  onClick={() =>
                    setLightboxData({
                      images: page.graphics,
                      index: i
                    })
                  }
                />
              </div>
            );
          })}

        </div>
      </div>

      <div className="us-container">
        {dupla
          .map((d, index) => (
            <UnaDupla
              key={d.id}
              index={index}
              name={d.name}
              role={d.role}
              description={d.description}
              image={d.image}
              layout={d.layout}
              linkedin={d.socials?.linkedin}
              instagram={d.socials?.instagram}
              cv={d.socials?.cv}
              email={d.socials?.email}
            />
          ))}
      </div>

      {lightboxData && (
        <Lightbox
          images={lightboxData.images}
          startIndex={lightboxData.index}
          onClose={() => setLightboxData(null)}
        />
      )}
      
    </div>
  );
}