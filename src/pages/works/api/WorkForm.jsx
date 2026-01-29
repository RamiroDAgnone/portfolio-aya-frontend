import MediaSection from "../../../components/forms/MediaSection";
import { useImageValidation } from "../../../utils/useImageValidation";

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
            key: "cover",
            title: "Cover",
            file: files.cover,
            current: formData.cover,
            error: fileErrors?.cover,
            onChange: file => onFileChange("cover", file),
            onValidationChange: hasError =>
              registerValidation("cover", hasError)
          },
          {
            key: "logo",
            title: "Logo",
            file: files.logo,
            current: formData.logo,
            error: fileErrors?.logo,
            onChange: file => onFileChange("logo", file),
            onValidationChange: hasError =>
              registerValidation("logo", hasError)
          }
        ]}
        imageArrays={[
          {
            title: "Gráficos",
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

      <button type="submit" disabled={loading || hasInvalidFiles || hasInvalidImages}>
        {loading ? "Guardando..." : submitText}
      </button>
    </form>
  );
}