import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../../auth/authFetch";
import { useImageFiles } from "../../../utils/useImageFiles";
import { uploadImages } from "../../../utils/uploadImages.js";
import { useVideos } from "../../../utils/useVideos";
import { UPLOAD_CONCURRENCY } from "../../../config/uploads.js";

import BProjectForm from "./BProjectForm";

export default function EditBProject() {
  const [projects, setProjects] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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
    authFetch("/bprojects/admin")
      .then(setProjects);
  }, []);

  const handleSelect = (e) => {
    const project = projects.find(p => p._id === e.target.value);
    setSelectedId(e.target.value);

    if (!project) {
      setFormData(null);
      setAllVideos([]);
      setFiles(prev => ({ ...prev, graphics: [] }));
      return;
    }

    setFormData({
      title: project.title,
      description: project.description,
      author: project.author,
      visibility: project.visibility ?? true
    });

    setAllVideos(
      (project.videos || []).map(v =>
        typeof v === "string" ? { url: v } : v
      )
    );

    setFiles(prev => ({
      ...prev,
      graphics: (project.graphics || []).map((img, index) => ({
        id: crypto.randomUUID(),
        current: img,
        file: null,
        remove: false,
        description: img.description || "",
        order: img.order ?? index * 10
      }))
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
        files: { graphics: files.graphics },
        uploadImage,
        concurrency: UPLOAD_CONCURRENCY
      });

      await authFetch(`/bprojects/admin/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          graphics: uploads.graphics || [],
          videos
        })
      });

      navigate("/lado-b");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="api-conteiner">
      <div className="work-api-container">
        <h2>Seleccionar el proyecto a editar</h2>

        <select className="work-select" value={selectedId} onChange={handleSelect}>
          <option value="">Seleccionar el proyecto</option>
          {projects.map(p => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>

        {selectedId && formData && (
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
        )}
      </div>
    </div>
  );
}
