import { useEffect, useState } from "react";
import { API_URL } from "../../auth/constants";
import { getResponsiveImageProps } from "../../utils/imageVariants";

import Lightbox from "../../components/lightbox/Lightbox";
import UnaDupla from "./UnaDupla";

import "./LaDupla.css";

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
    <div
      className="about-container"
      style={{ backgroundColor: page.backgroundColor }}
    >
      <div className="dupla-container">
        <div className="dupla-layout">
          {page.graphics?.map((img, i) => (
            <div key={i} className={`dupla-img dupla-${i + 1}`}>
              <img
                className="dupla-photo"
                loading="lazy"
                decoding="async"
                {...getResponsiveImageProps({
                  image: img,
                  sizes: "(max-width: 768px) 90vw, 1200px"
                })}
                alt={page.title}
                onClick={() =>
                  setLightboxData({
                    images: page.graphics,
                    i
                  })
                }
              />
            </div>
          ))}
          <div className="dupla-desc">
            <h1>{page.title}</h1>
            {page.description?.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="us-container">
        {dupla
          .filter(d => d.active)
          .map(d => (
            <UnaDupla
              key={d._id}
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