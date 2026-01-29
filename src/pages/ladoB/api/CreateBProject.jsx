import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../../auth/authFetch";
import { useImageFiles } from "../../../utils/useImageFiles";
import { uploadImages } from "../../../utils/uploadImages.js";
import { useVideos } from "../../../utils/useVideos";
import { UPLOAD_CONCURRENCY } from "../../../config/uploads.js";

import BProjectForm from "./BProjectForm";

export default function CreateBProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    author: "",
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
    imageArrays,
    uploadImage
  } = useImageFiles({
    resource: "bprojects",
    config: {
      graphics: { type: "array" }
    },
    initialData: {
      graphics: []
    }
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || hasInvalidFiles) return;

    setLoading(true);
    setError(null);

    try {
      const created = await authFetch("/bprojects/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          videos
        })
      });

      const uploads = await uploadImages({
        workId: created._id,
        files,
        uploadImage,
        concurrency: UPLOAD_CONCURRENCY
      });

      await authFetch(`/bprojects/admin/${created._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          ...uploads,
          videos
        })
      });

      navigate("/lado-b");
    } catch (err) {
      setError(err.message || "Error creando proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-conteiner">
      <div className="create-work-container">
        {error && <p className="form-error">{error}</p>}

        <BProjectForm
          title="Crear un Proyecto B"
          formData={formData}
          files={files}
          videos={videos}
          fileErrors={fileErrors}
          hasInvalidFiles={hasInvalidFiles}
          onChange={handleChange}
          
          graphics={imageArrays.graphics}

          onVideoAdd={addVideo}
          onVideoChange={changeVideo}
          onVideoRemove={removeVideo}
          reorderVideos={reorderVideos}
          
          onSubmit={handleSubmit}
          submitText="Crear proyecto"
          loading={loading}
        />
      </div>
    </div>
  );
}
