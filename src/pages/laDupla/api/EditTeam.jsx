import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../../../auth/authFetch";
import { useImageFiles } from "../../../utils/useImageFiles";

import TeamForm from "./TeamForm";

export default function EditTeam() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    files,
    fileErrors,
    hasInvalidFiles,
    setSingle,
    uploadImage
  } = useImageFiles({
    resource: "team",
    config: {
      image: { type: "single" }
    },
    initialData: {
      image: null
    }
  });

  useEffect(() => {
    authFetch(`/team/admin/${id}`).then(data => {
      if (data) setMember(data);
    });
  }, [id]);

  async function handleUpdate(formData) {
    if (loading || hasInvalidFiles) return;

    setLoading(true);
    try {
      const imagePayload = {};

      // subir imagen nueva si existe
      if (files.image) {
        const image = await uploadImage(id, files.image, "image");
        imagePayload.image = image;
      }

      await authFetch(`/team/admin/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, ...imagePayload })
      });

      navigate("/la-dupla");
    } finally {
      setLoading(false);
    }
  }

  if (!member) return null;

  return (
    <div className="api-conteiner">
      <TeamForm
        initialData={member}
        files={files}
        fileErrors={fileErrors}
        onImageChange={file => setSingle("image", file)}
        onSubmit={handleUpdate}
        submitText="Guardar cambios"
        loading={loading}
      />
    </div>
  );
}