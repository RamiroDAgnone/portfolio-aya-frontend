import MediaSection from "../../../components/forms/MediaSection";
import { useImageValidation } from "../../../utils/useImageValidation";
import ColorField from "../../../components/forms/ColorField";

import "./WorkApi.css";

export default function WorkForm({
  title,
  formData,
  files,
  videos,
  fileErrors,
  hasInvalidFiles,
  onChange,
  onFileChange,
  onToggleRemoveSingle,

  graphics,
  extraImages,

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

      <h3>Título de la campaña</h3>
      <input
        name="title"
        placeholder="Título de la campaña"
        value={formData.title || ""}
        onChange={onChange}
        required
      />

      <h3>Descripción de la campaña</h3>
      <textarea
        name="description"
        placeholder="Descripción de la campaña"
        value={formData.description || ""}
        onChange={onChange}
      />

      <h3>Tipo de campaña</h3>
      <select
        name="campaignType"
        value={formData.campaignType || ""}
        onChange={onChange}
        required
      >
        <option value="">Seleccionar</option>
        <option value="accion">Acción</option>
        <option value="grafica">Gráfica</option>
        <option value="film">Film</option>
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
      
      <ColorField
        label="Color de fondo"
        name="backgroundColor"
        value={formData.backgroundColor}
        onChange={onChange}
      />

      <MediaSection
        singleImages={[
          {
            key: "cover",
            title: "Portada de la campaña",
            file: files.cover?.file ?? null,
            current: files.cover?.current ?? formData.cover,
            remove: files.cover?.remove ?? false,
            error: fileErrors?.cover,
            onChange: file => onFileChange("cover", file),
            onToggleRemove: () => onToggleRemoveSingle("cover"),
            onValidationChange: hasError =>
              registerValidation("cover", hasError)
          },
          {
            key: "logo",
            title: "Logo (lo más cercano a los bordes posible)",
            file: files.logo?.file ?? null,
            current: files.logo?.current ?? formData.logo,
            remove: files.logo?.remove ?? false,
            error: fileErrors?.logo,
            onChange: file => onFileChange("logo", file),
            onToggleRemove: () => onToggleRemoveSingle("logo"),
            onValidationChange: hasError =>
              registerValidation("logo", hasError)
          }
        ]}
        imageArrays={[
          {
            title: "Board o imagenes de campaña grafica",
            items: files.graphics,
            controls: {
              ...graphics,
              onValidationChange: registerValidation
            }
          },
          {
            title: "Imágenes extra",
            items: files.extraImages,
            controls: {
              ...extraImages,
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

      <button type="submit" disabled={loading || hasInvalidFiles || hasInvalidImages} className="form-button">
        {loading ? "Guardando..." : submitText}
      </button>
    </form>
  );
}