import { useEffect, useState } from "react";
import { API_URL } from "../../auth/constants";
import { getResponsiveImageProps } from "../../utils/imageVariants";

import ProyectoB from "./ProyectoB.jsx";

import "./LadoB.css";
import "../../components/css/Scrapbook.css"

let bProjectsCache = null;

export default function LadoB({ page }) {
  const [projects, setProjects] = useState([]);  

  useEffect(() => {
    if (bProjectsCache) {
      setProjects(bProjectsCache);
      return;
    }

    fetch(`${API_URL}/bprojects`)
      .then(res => res.json())
      .then(data => {
        bProjectsCache = data;
        setProjects(data);
      })
      .catch(err =>
        console.error("Error cargando Lado B:", err)
      );
  }, []);

  return (
    <section className="ladoB"  
      style= {{ 
        "--bg-color": page.backgroundColor, 
        "--line-color": page.linesColor?.length === 7 ? page.linesColor + "B3" : page.linesColor
      }}
    >
      <header className="ladoB-header">
        {page.image && page.image.sizes && (() => {
          const baseSize =
            page.image.sizes[600] || Object.values(page.image.sizes)[0];

          return (
            <div className="ladoB-logo">
              <img
                {...getResponsiveImageProps({
                  image: page.image,
                  sizes: "(max-width: 768px) 90vw, 1200px"
                })}
                width={baseSize.realWidth}
                height={baseSize.realHeight}
                style={{
                  aspectRatio: `${baseSize.realWidth} / ${baseSize.realHeight}`
                }}
                loading="eager"
                decoding="async"
                alt={page.title}
              />
            </div>
          );
        })()}

        {page.description?.split("\n").map((line, i) => (
          <p key={i} className="ladoB-description">{line}</p>
        ))}

      </header>

      <div className="ladoB-projects">
        {projects.map((project, index) => (
          <ProyectoB
            key={project.id}
            index={index}
            title={project.title}
            description={project.description}
            graphics={project.graphics || []}
            author={project.author}
            reverse={index % 2 !== 0}
            pinVariant={index % 6}
          />
        ))}
      </div>
    </section>
  );
}
