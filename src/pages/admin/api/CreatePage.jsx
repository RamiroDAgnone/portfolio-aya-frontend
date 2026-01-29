import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../../auth/authFetch";
import { useImageFiles } from "../../../utils/useImageFiles";
import { uploadImages } from "../../../utils/uploadImages";
import { useVideos } from "../../../utils/useVideos";

import PageForm from "./PageForm";

export default function CreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    backgroundColor: "#ffffff",
    status: "draft"
  });

  const {
    videos,
    addVideo,
    changeVideo,
    removeVideo,
    reorderVideos,
    serializeVideos
  } = useVideos();

  const {
    files,
    fileErrors,
    hasInvalidFiles,
    setSingle,
    imageArrays,
    uploadImage
  } = useImageFiles({
    resource: "pages",
    config: {
      image: { type: "single" },
      graphics: { type: "array" }
    },
    initialData: {
      image: null,
      graphics: []
    }
  });

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || hasInvalidFiles) return;

    setLoading(true);
    setError(null);

    try {
      const cleanVideos = serializeVideos();

      const page = await authFetch("/pages/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          videos: cleanVideos
        })
      });

      const uploads = await uploadImages({
        workId: page._id,
        files,
        uploadImage
      });

      await authFetch(`/pages/admin/${page._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...uploads,
          videos: cleanVideos
        })
      });

      navigate(`/${page.slug}`);
    } catch (err) {
      setError(err.message || "Error creando página");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-conteiner">
      <div className="work-api-container">
        {error && <p className="form-error">{error}</p>}

        <PageForm
          title="Crear nueva página"
          formData={formData}
          files={files}
          videos={videos}
          fileErrors={fileErrors}
          hasInvalidFiles={hasInvalidFiles}

          onChange={handleChange}
          onFileChange={setSingle}

          graphics={imageArrays.graphics}

          onVideoAdd={addVideo}
          onVideoChange={changeVideo}
          onVideoRemove={removeVideo}
          reorderVideos={reorderVideos}

          onSubmit={handleSubmit}
          submitText="Crear página"
          loading={loading}
        />
      </div>
    </div>
  );
}