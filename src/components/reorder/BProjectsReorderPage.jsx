import ReorderManager from "../../components/reorder/ReorderManager";
import { ASSETS_URL } from "../../auth/constants";

function BProjectAdminCard({ project }) {
  const main = (project.graphics || [])[0];

  // normalizar path
  const imgPath = main?.sizes?.[600]?.path ? `${ASSETS_URL.replace(/\/$/, "")}${main.sizes[600].path}` : null;

  return (
    <div className="card">
      <div className="card-image">
        {imgPath ? (
          <img src={imgPath} alt={project.title} />
        ) : (
          <div className="card-placeholder">Sin imagen</div>
        )}
      </div>
      <div className="card-overlay">
        <h1>{project.title}</h1>
      </div>
    </div>
  );
}

export default function BProjectsReorderPage() {
  return (
    <ReorderManager
      apiBase="/bprojects/admin"
      renderItem={(project) => (
        <BProjectAdminCard project={project} />
      )}
    />
  );
}