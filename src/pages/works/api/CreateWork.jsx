import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../../auth/authFetch";
import { useImageFiles } from "../../../utils/useImageFiles";
import { uploadImages } from "../../../utils/uploadImages";
import { useVideos } from "../../../utils/useVideos";

import WorkForm from "./WorkForm";

export default function CreateWork() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    campaignType: "",
    backgroundColor: "#ffffff",
    status: "draft"
  });

  const {
    videos,
    addVideo,
    changeVideo,
    removeVideo,
    reorderVideos
  } = useVideos();

const {
  files,
  fileErrors,
  hasInvalidFiles,
  setSingle,
  imageArrays,
  uploadImage
} = useImageFiles({
  resource: "works",
  config: {
    cover: { type: "single" },
    logo: { type: "single" },
    graphics: { type: "array" },
    extraImages: { type: "array" }
  },
  initialData: {
    cover: null,
    logo: null,
    graphics: [],
    extraImages: []
  }
});

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (loading || hasInvalidFiles) return;
    if (!formData.campaignType) {
      setError("Seleccioná el tipo de campaña antes de crear.");
      return;
    }

    setLoading(true);

    try {
      const cleanVideos = (videos || [])
      .map(v => ({
        url: v?.url,
        order: v?.order
      }))
      .filter(v => v.url && v.url.trim());

      const work = await authFetch("/works/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          videos: cleanVideos
        })
      });

      const uploads = await uploadImages({
        workId: work._id,
        files,
        uploadImage
      });

      await authFetch(`/works/admin/${work._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...uploads,
          videos: cleanVideos
        })
      });

      navigate("/admin/works");
    } catch (err) {
      setError(err.message || "Error creando campaña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-conteiner">
      <div className="work-api-container">
        {error && <p className="form-error">{error}</p>}

        <WorkForm
          title="Crear un nuevo trabajo"
          formData={formData}
          files={files}
          videos={videos}
          fileErrors={fileErrors}
          hasInvalidFiles={hasInvalidFiles}

          onChange={handleChange}
          onFileChange={setSingle}

          graphics={imageArrays.graphics}
          extraImages={imageArrays.extraImages}

          onVideoAdd={addVideo}
          onVideoChange={changeVideo}
          onVideoRemove={removeVideo}
          reorderVideos={reorderVideos}

          onSubmit={handleSubmit}
          submitText="Crear trabajo"
          loading={loading}
        />

      </div>
    </div>
  );
}
