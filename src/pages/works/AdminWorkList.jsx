import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../../auth/authFetch";
import { getResponsiveImageProps } from "../../utils/imageVariants";

import "./Works.css";

export default function AdminWorkList() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    authFetch("/works/admin").then(setWorks);
  }, []);

  return (
    <div className="admin-works-page">
      <header className="admin-works-header">
        <h2>Trabajos</h2>

        <div className="admin-actions">
          <Link to="/admin/work/create" className="admin-btn primary">
            Crear trabajo
          </Link>

          <Link to="/" className="admin-btn secondary" target="_blank">
            Ver público
          </Link>
        </div>
      </header>

      <div className="works">
        {works.map(work => {
          const hasImage = Boolean(work.cover && work.cover.sizes);

          return (
            <div key={work._id} className="card admin-card">
              <div className="card-image">
                {hasImage ? (
                  <img
                    {...getResponsiveImageProps({
                      image: work.cover,
                      sizes:
                        "(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 400px"
                    })}
                    loading="lazy"
                    decoding="async"
                    alt={work.title}
                  />
                ) : (
                  <div className="card-placeholder">
                    <span>Sin imagen</span>
                  </div>
                )}
              </div>
              
              <div className="card-overlay">
                <h1>{work.title}</h1>

                <span className={`detail status ${work.status}`}>
                  {work.status}
                </span>

                <div className="admin-card-actions">
                  <Link
                    to={`/admin/work/edit/${work._id}`}
                    className="admin-btn small"
                  >
                    Editar
                  </Link>

                  <Link
                    to={`/trabajos/${work.slug}`}
                    className="admin-btn small secondary"
                    target="_blank"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
