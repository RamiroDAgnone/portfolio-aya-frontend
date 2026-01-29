import { useEffect, useState } from "react";
import { API_URL } from "../../auth/constants";
import { getResponsiveImageProps } from "../../utils/imageVariants";

import ProyectoB from "./ProyectoB.jsx";

import "./LadoB.css";

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
    <section className="ladoB"  style={{ backgroundColor: page.backgroundColor }}>
      <header className="ladoB-header">
        {page.image && page.image.sizes && (
          <div className="ladoB-logo">
            <img
              {...getResponsiveImageProps({
                image: page.image,
                sizes: "(max-width: 768px) 90vw, 1200px"
                })}
                loading="eager"
                decoding="async"
                alt={page.title}
              />
          </div>
        )}

        {page.description?.split("\n").map((line, i) => (
          <p key={i} className="ladoB-description">{line}</p>
        ))}

      </header>

      <div className="ladoB-projects">
        {projects.map((project, index) => (
          <ProyectoB
            key={project._id}
            title={project.title}
            description={project.description}
            graphics={project.graphics || []}
            author={project.author}
            reverse={index % 2 !== 0}
          />
        ))}
      </div>
    </section>
  );
}
