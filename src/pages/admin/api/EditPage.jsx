import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../../auth/authFetch";
import { useImageFiles } from "../../../utils/useImageFiles";
import { uploadImages } from "../../../utils/uploadImages";
import { useVideos } from "../../../utils/useVideos";

import PageForm from "./PageForm";

export default function EditPage() {
  const [pages, setPages] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    files,
    setFiles,
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
    authFetch("/pages/admin").then(setPages);
  }, []);

  const handleSelect = (e) => {
    const page = pages.find(p => p._id === e.target.value);
    if (!page) return;

    setSelectedId(page._id);

    const { _id, createdAt, updatedAt, __v, ...clean } = page;
    setFormData(clean);

    setAllVideos(page.videos || []);

    const genId = () =>
      (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);

    const wrapBackendArray = (arr = []) =>
      arr.map((img, i) => ({
        id: genId(),
        current: img ?? null,
        file: null,
        remove: false,
        description: img?.description ?? "",
        order: img?.order ?? i * 10
      }));

    setFiles(prev => ({
      ...prev,
      image: page.image ?? null,
      graphics: wrapBackendArray(page.graphics)
    }));
  };


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

      const cleanVideos = serializeVideos();

      const body = {
        ...formData,
        ...uploads,
        graphics: uploads.graphics ?? formData.graphics,
        videos: cleanVideos
      };

      await authFetch(`/pages/admin/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      navigate(`/${formData.slug}`);
    } catch (err) {
      console.error("EditPage handleSubmit error:", err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="api-conteiner">
      <div className="work-api-container">
        <select
          value={selectedId}
          onChange={handleSelect}
          className="work-select"
        >
          <option value="">Seleccionar página</option>
          {pages.map(p => (
            <option key={p._id} value={p._id}>
              {p.title}
            </option>
          ))}
        </select>

        <PageForm
          title="Editar página"
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
          submitText="Actualizar"
          loading={loading}
        />
      </div>
    </div>
  );
}