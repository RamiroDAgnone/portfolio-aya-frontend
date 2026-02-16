import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authFetch } from "../../auth/authFetch";

import "../../components/css/Scrapbook.css";
import "./AdminDecorationList.css";

export default function AdminDecorationList() {
  const [decorations, setDecorations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDecorations() {
      try {
        const data = await authFetch("/decorations/admin");
        setDecorations(data);
      } catch (err) {
        console.error("Error loading decorations:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDecorations();
  }, []);

  if (loading) return <p>Cargando decoraciones...</p>;

  return (
    <div className="admin-decoration-page">
      
      <div className="admin-decoration-header">
        <h2>Decoraciones</h2>
        {/*
        <Link to="/admin/decoration/create" className="admin-btn primary">
          + Crear Decoration
        </Link>
        */}
      </div>

      {decorations.length === 0 ? (
        <p>No hay decoraciones creadas todavía.</p>
      ) : (

        <div className="decoration-list">
          {decorations.map((d) => {
            const firstVariation = d.variation?.[0]?.name;
            const firstColor = d.colors?.[0];

            const previewClass =
              firstVariation && d.name
                ? `scrap-base scrap-${d.name}-${firstVariation}`
                : "scrap-base";

            const previewVars = firstColor
              ? {
                  "--color-light": firstColor.colors.light,
                  "--color-dark": firstColor.colors.dark
                }
              : {};

            return (
              <div key={d._id} className="decoration-row">
                <div
                  className={`decoration-thumb ${previewClass}`}
                  style={previewVars}
                />
                <div className="decoration-meta">
                  <h3>{d.name}</h3>

                  <p>
                    <b>{d.variation?.length || 0}</b> variantes ·{" "}
                    <b>{d.colors?.length || 0}</b> colores
                  </p>

                </div>

                <div className="decoration-actions">
                  <Link
                    to={`/admin/decoration/edit/${d._id}`}
                    className="admin-btn secondary small"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

}
