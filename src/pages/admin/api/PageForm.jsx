import MediaSection from "../../../components/forms/MediaSection";
import { useImageValidation } from "../../../utils/useImageValidation";

import "../../works/api/WorkApi.css";

export default function PageForm({
  title,
  formData,
  files,
  videos,
  fileErrors,
  hasInvalidFiles,
  onChange,
  onFileChange,

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

      <h3>Título</h3>
      <input
        name="title"
        placeholder="Título de la página"
        value={formData.title || ""}
        onChange={onChange}
        required
      />

      <h3>Slug</h3>
      <input
        name="slug"
        placeholder="slug-de-la-pagina"
        value={formData.slug || ""}
        onChange={onChange}
      />

      <h3>Descripción</h3>
      <textarea
        name="description"
        placeholder="Descripción de la página"
        value={formData.description || ""}
        onChange={onChange}
      />

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

      <h3>Color de fondo</h3>
      <div className="color-row">
        <label className="color-square">
          <input
            type="color"
            name="backgroundColor"
            value={formData.backgroundColor || "#ffffff"}
            onChange={onChange}
          />
        </label>
        <label className="color-hex">
          <input
            type="text"
            name="backgroundColor"
            value={formData.backgroundColor || "#ffffff"}
            onChange={onChange}
          />
        </label>
      </div>

      <MediaSection
        singleImages={[
          {
            key: "image",
            title: "Imagen principal",
            file: files.image,
            current: formData.image,
            error: fileErrors?.image,
            onChange: file => onFileChange("image", file),
            onValidationChange: hasError =>
              registerValidation("image", hasError)
          }
        ]}
        imageArrays={[
          {
            title: "Galería",
            items: files.graphics,
            controls: {
              ...graphics,
              onValidationChange: registerValidation
            }
          }
        ]}
        videosConfig={{
          title: "Videos",
          videos,
          onAdd: onVideoAdd,
          onChange: onVideoChange,
          onRemove: onVideoRemove,
          onReorder: reorderVideos
        }}
      />

      <button type="submit" disabled={loading || hasInvalidFiles || hasInvalidImages}>
        {loading ? "Guardando..." : submitText}
      </button>
    </form>
  );
}