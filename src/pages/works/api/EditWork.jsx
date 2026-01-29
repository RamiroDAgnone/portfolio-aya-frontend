import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../../../auth/authFetch";
import { useImageFiles } from "../../../utils/useImageFiles";
import { uploadImages } from "../../../utils/uploadImages";
import { useVideos } from "../../../utils/useVideos";

import WorkForm from "./WorkForm";

export default function EditWork() {
  const { id: selectedId } = useParams();
  const navigate = useNavigate();

  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    files,
    setFiles,
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

  const {
    videos,
    addVideo,
    changeVideo,
    removeVideo,
    setAllVideos,
    reorderVideos,
    serializeVideos
  } = useVideos();

  useEffect(() => {
    if (!selectedId || initialized) return;

    authFetch(`/works/admin/${selectedId}`).then(work => {
      if (!work) return;

      const { _id, createdAt, updatedAt, __v, ...clean } = work;
      setFormData(clean);

      setAllVideos(work.videos || []);

      const wrapBackendArray = (arr = []) =>
        arr.map((img, i) => ({
          id: crypto.randomUUID?.() ?? `id-${Date.now()}-${i}`,
          current: img ?? null,
          file: null,
          remove: false,
          description: img?.description ?? "",
          order: img?.order ?? i * 10
        }));

      setFiles({
        cover: work.cover ?? null,
        logo: work.logo ?? null,
        graphics: wrapBackendArray(work.graphics),
        extraImages: wrapBackendArray(work.extraImages)
      });

      setInitialized(true);
    });
  }, [ selectedId, initialized, setFiles, setAllVideos ]);

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || hasInvalidFiles || !selectedId) return;

    setLoading(true);

    try {
      const uploads = await uploadImages({
        workId: selectedId,
        files,
        uploadImage
      });

      /* ---------- LIMPIAR VIDEOS ---------- */
      const cleanVideos = serializeVideos();

      const body = {
        ...formData,
        ...uploads,
        graphics: uploads.graphics,
        extraImages: uploads.extraImages,
        videos: cleanVideos
      };

      await authFetch(`/works/admin/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      navigate(`/trabajos/${formData.slug}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="api-conteiner">
      <div className="work-api-container">

        <WorkForm
          title="Editar Trabajo"
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
          submitText="Actualizar"
          loading={loading}
        />

      </div>
    </div>
  );
}
