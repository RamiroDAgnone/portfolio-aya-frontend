import { useEffect, useState } from "react";
import { API_URL } from "../../auth/constants";
import { getResponsiveImageProps } from "../../utils/imageVariants";
import { getDecorations } from "../../services/decorationsService";

import ProyectoB from "./ProyectoB.jsx";

import "./LadoB.css";
import "../../components/css/Scrapbook.css"

let bProjectsCache = null;

export default function LadoB({ page }) {
  const [projects, setProjects] = useState([]);
  const [decorationsData, setDecorationsData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (bProjectsCache) {
          setProjects(bProjectsCache);
        } else {
          const res = await fetch(`${API_URL}/bprojects`);
          const data = await res.json();
          bProjectsCache = data;
          setProjects(data);
        }

        const decorations = await getDecorations();
        setDecorationsData(decorations);

      } catch (err) {
        console.error("Error cargando Lado B:", err);
      }
    };

    loadData();
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
            title={project.title}
            description={project.description}
            graphics={project.graphics || []}
            author={project.author}
            reverse={index % 2 !== 0}
            decorations={project.decorations}
            decorationsData={decorationsData}
          />
        ))}
      </div>
    </section>
  );
}
