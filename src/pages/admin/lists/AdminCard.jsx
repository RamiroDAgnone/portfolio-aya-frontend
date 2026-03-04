import { Link } from "react-router-dom";
import { getResponsiveImageProps } from "../../../utils/imageVariants";

const STATUS_LABELS = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado"
};

export default function AdminCard({
  item,
  image,
  title,
  status,
  editUrl,
  viewUrl,
  overlayId,
  setOverlayId
}) {
  const active = overlayId === item._id;
  const hasImage = Boolean(image && image.sizes);

  return (
    <div className="card admin-card">
      <div
        className="card-image"
        onClick={() => setOverlayId(active ? null : item._id)}
      >
        {hasImage ? (
          <img
            {...getResponsiveImageProps({
              image,
              sizes:
                "(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 400px"
            })}
            loading="lazy"
            decoding="async"
            alt={title}
          />
        ) : (
          <div className="card-placeholder">
            <span>Sin imagen</span>
          </div>
        )}
      </div>

      <div className={`card-overlay ${active ? "active-mobile" : ""}`}>
        <h1>{title}</h1>

        {status && (
          <span className={`detail status ${status}`}>
            {STATUS_LABELS[status] ?? status}
          </span>
        )}

        <div className="admin-card-actions">
          <Link to={editUrl} className="admin-btn small primary">
            Editar
          </Link>

          {viewUrl && (
            <Link
              to={viewUrl}
              className="admin-btn small secondary"
              target="_blank"
            >
              Ver
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
