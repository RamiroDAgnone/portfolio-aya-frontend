import { useEffect, useState } from "react";
import { getResponsiveImageProps } from "../../utils/imageVariants";
import { getScrapDecoration } from "../../utils/getScrapDecoration";
import { getDecorations } from "../../services/decorationsService";
import { getTeam } from "../../services/teamService";

import StarBackground from "../../components/decorations/StarBackground";
import Lightbox from "../../components/lightbox/Lightbox";
import UnaDupla from "./UnaDupla";

import "./LaDupla.css";
import "../../components/css/Scrapbook.css"

export default function LaDupla({ page }) {
  const [dupla, setDupla] = useState([]);
  const [decorationsData, setDecorationsData] = useState([]);
  
  //const pin = getScrapDecoration(decorationsData, page.decorations, "pin");
  const tape = getScrapDecoration(decorationsData, page.decorations, "tape");

  const [lightboxData, setLightboxData] = useState(null);

  useEffect(() => {
    getTeam()
      .then(setDupla)
      .catch(console.error);
  }, []);

  useEffect(() => {
    getDecorations()
      .then(setDecorationsData)
      .catch(console.error);
  }, []);

  return (
    <div className="about-container" 
      style= {{ 
        "--bg-color": page.backgroundColor, 
        "--line-color": page.linesColor?.length === 7 ? page.linesColor + "B3" : page.linesColor
      }} 
    >
      <StarBackground />
      <div className="dupla-container">
        <div className="dupla-layout">
          <div className={`dupla-desc scrap-base ${tape?.className || ""}`}
            style={tape?.style}
          >
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
                  alt=""
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
          .map(d => (
            <UnaDupla
              key={d.id}
              name={d.name}
              role={d.role}
              description={d.description}
              image={d.image}
              layout={d.layout}
              decorations={d.decorations}
              decorationsData={decorationsData}
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