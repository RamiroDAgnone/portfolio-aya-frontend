import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../../auth/authFetch";
import { getResponsiveImageProps } from "../../utils/imageVariants";

import "./Works.css";

export default function AdminWorkList() {
  const [works, setWorks] = useState([]);
  const [activeOverlay, setActiveOverlay] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  
  const filteredWorks = statusFilter
  ? works.filter(work => work.status === statusFilter)
  : works;

  useEffect(() => {
    authFetch("/works/admin").then(setWorks);
  }, []);

  return (
    <div className="admin-works-page">
      <header className="admin-works-header">
        <h2>Trabajos</h2>

        <div className="admin-actions">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="admin-btn select-filter"
          >
            <option value="">Todos</option>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </select>

          <Link to="/admin/work/create" className="admin-btn primary">
            Crear trabajo
          </Link>

          <Link to="/" className="admin-btn secondary" target="_blank">
            Ver público
          </Link>
        </div>
      </header>

      <div className="works">
        {filteredWorks.map(work => {
          const hasImage = Boolean(work.cover && work.cover.sizes);

          return (
            <div key={work._id} className="card admin-card">
              <div className="card-image" key={work._id} 
                onClick={() => setActiveOverlay(activeOverlay === work._id ? null : work._id)} 
              >
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
              
              <div className={`card-overlay ${
                activeOverlay === work._id ? "active-mobile" : ""
                }`}
              >
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
