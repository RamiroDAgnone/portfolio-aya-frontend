import MediaSection from "../../../components/forms/MediaSection";
import { useImageValidation } from "../../../utils/useImageValidation";

import "../../works/api/WorkApi.css";

export default function BProjectForm({
  title,
  formData,
  files,
  videos,
  fileErrors,
  hasInvalidFiles,
  onChange,

  graphics,

  onVideoAdd,
  onVideoChange,
  onVideoRemove,  
  reorderVideos,

  onSubmit,
  submitText,
  loading = false
}) {
  const { registerValidation, hasInvalidImages } = useImageValidation();

  if (!formData || !files) return null;

  return (
    <form className="work-form" onSubmit={onSubmit}>
      <h2>{title}</h2>

      <label>Título del Proyecto</label>
      <input
        name="title"
        placeholder="Título del Proyecto"
        value={formData.title || ""}
        onChange={onChange}
        required
      />

      <label>Descripción</label>
      <textarea
        name="description"
        placeholder="Descripción del Proyecto"
        value={formData.description || ""}
        onChange={onChange}
      />

      <label>Autor</label>
      <select
        name="author"
        value={formData.author || ""}
        onChange={onChange}
        required
      >
        <option value="">Seleccionar autor</option>
        <option value="autor1">Ana Montesino</option>
        <option value="autor2">Agustina Lubris</option>
      </select>

      <h3>Estado</h3>
      <select
        name="status"
        value={formData.status || "draft"}
        onChange={onChange}
      >
        <option value="draft">Borrador</option>
        <option value="published">Publicado</option>
        <option value="archived">Archivado</option>
      </select>

      <MediaSection
        imageArrays={[
          {
            title: "Imágenes",
            items: files.graphics,
            controls: {
              ...graphics,
              onValidationChange: registerValidation
            }
          }
        ]}
        videosConfig={{
          title: "URL de Videos (YouTube)",
          videos,
          onAdd: onVideoAdd,
          onChange: onVideoChange,
          onRemove: onVideoRemove,
          onReorder: reorderVideos
        }}
      />

      <button type="submit" disabled={loading || hasInvalidFiles || hasInvalidImages}>
        {loading ? "Procesando..." : submitText}
      </button>
    </form>
  );
}