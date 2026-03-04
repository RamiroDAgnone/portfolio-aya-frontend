import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../../../auth/authFetch";
import { useImageFiles } from "../../../utils/useImageFiles";
import { uploadImages } from "../../../utils/uploadImages.js";
import { useVideos } from "../../../utils/useVideos";
import { UPLOAD_CONCURRENCY } from "../../../config/uploads.js";

import BProjectForm from "./BProjectForm";

export default function EditBProject() {
  const { id: selectedId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const {
    files,
    setFiles,
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

  const {
    videos,
    addVideo,
    changeVideo,
    removeVideo,
    setAllVideos,
    reorderVideos
  } = useVideos();

  useEffect(() => {
    if (!selectedId || initialized) return;

    authFetch(`/bprojects/admin/${selectedId}`).then(project => {
      if (!project) return;

      const { _id, createdAt, updatedAt, __v, ...clean } = project;

      setFormData({
        title: clean.title,
        description: clean.description,
        author: clean.author,
        visibility: clean.visibility ?? true,
        decorations: clean.decorations || []
      });

      setAllVideos(
        (project.videos || []).map(v =>
          typeof v === "string" ? { url: v } : v
        )
      );

      setFiles({
        graphics: (project.graphics || []).map((img, index) => ({
          id: crypto.randomUUID?.() ?? `img-${index}-${Date.now()}`,
          current: img,
          file: null,
          remove: false,
          description: img?.description || "",
          order: img?.order ?? index * 10
        }))
      });

      setInitialized(true);
    });
  }, [selectedId, initialized, setFiles, setAllVideos]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || hasInvalidFiles || !selectedId) return;

    setLoading(true);

    try {
      const uploads = await uploadImages({
        workId: selectedId,
        files: { graphics: files.graphics },
        uploadImage,
        concurrency: UPLOAD_CONCURRENCY
      });

      await authFetch(`/bprojects/admin/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          decorations: formData.decorations,
          graphics: uploads.graphics || [],
          videos
        })
      });

      navigate("/lado-b");
    } finally {
      setLoading(false);
    }
  };

  if (!formData) return null;

  return (
    <div className="api-conteiner">
      <div className="work-api-container">
        <BProjectForm
          title="Editar un Proyecto B"
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
          submitText="Actualizar"
          loading={loading}
        />
      </div>
    </div>
  );
}
