import { useEffect, useState } from "react";
import MediaSection from "../../../components/forms/MediaSection";
import { useImageValidation } from "../../../utils/useImageValidation";

import "../../works/api/WorkApi.css";

export default function TeamForm({
  initialData,
  files,
  onImageChange,
  onSubmit,
  submitText,
  loading = false
}) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    layout: "left",
    order: 0,
    active: true,
    socials: {
      linkedin: "",
      instagram: "",
      cv: ""
    }
  });

  const { registerValidation, hasInvalidImages } = useImageValidation();

  /* ---------- cargar data inicial ---------- */
  useEffect(() => {
    if (!initialData) return;

    setFormData({
      name: initialData.name || "",
      role: initialData.role || "",
      description: initialData.description || "",
      layout: initialData.layout || "left",
      order: initialData.order ?? 0,
      active: initialData.active ?? true,
      socials: {
        linkedin: initialData.socials?.linkedin || "",
        instagram: initialData.socials?.instagram || "",
        cv: initialData.socials?.cv || ""
      }
    });
  }, [initialData]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("socials.")) {
      const key = name.split(".")[1];
      setFormData(prev => ({
        ...prev,
        socials: {
          ...prev.socials,
          [key]: value
        }
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(formData);
  }

  return (
    <div className="work-api-container">
      <form onSubmit={handleSubmit} className="work-form">

        <label>Nombre</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Rol</label>
        <input
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        />

        <label>Descripción individual</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>
          <input
            type="checkbox"
            name="active"
            checked={formData.active}
            onChange={handleChange}
          />
          Perfil activo (Mantener en tick)
        </label>

        <label>Link completo a perfil de LinkedIn</label>
        <input
          name="socials.linkedin"
          value={formData.socials.linkedin}
          onChange={handleChange}
        />

        <label>Link completo a perfil de Instagram</label>
        <input
          name="socials.instagram"
          value={formData.socials.instagram}
          onChange={handleChange}
        />

        <label>Link completo al alojamiento del CV (PDF)</label>
        <input
          name="socials.cv"
          value={formData.socials.cv}
          onChange={handleChange}
        />

        <MediaSection
          singleImages={[
            {
              key: "image",
              title: "Imagen individual",
              file: files?.image,
              current: initialData?.image,
              onChange: file => onImageChange(file),
              onValidationChange: hasError =>
                registerValidation("image", hasError)
            }
          ]}
        />

        <button disabled={loading || hasInvalidImages}>
          {loading ? "Guardando..." : submitText}
        </button>

      </form>
    </div>
  );
}
