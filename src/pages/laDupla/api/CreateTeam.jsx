import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../auth/constants";
import { useImageFiles } from "../../../utils/useImageFiles";

import TeamForm from "./TeamForm";

export default function CreateTeam() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    files,
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

  async function handleCreate(formData) {
    if (loading || hasInvalidFiles) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/team`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const created = await res.json();

      if (files.image) {
        const image = await uploadImage(
          created._id,
          files.image,
          "image"
        );

        await fetch(`${API_URL}/team/${created._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            image
          })
        });
      }

      navigate("/la-dupla");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="api-conteiner">
      <TeamForm
        files={files}
        onImageChange={file => setSingle("image", file)}
        onSubmit={handleCreate}
        submitText="Crear integrante"
        loading={loading}
      />
    </div>
  );
}
