import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authFetch } from "../../auth/authFetch";

import DecorationForm from "./DecorationForm";

export default function CreateDecoration() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    variation: [],
    colors: []
  });

  const handleSubmit = async e => {
    e.preventDefault();

    await authFetch("/decorations/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        variation: formData.variation,
        colors: formData.colors
      })
    });

    navigate("/admin/decorations");
  };

  return (
    <div className="api-conteiner">
      <DecorationForm
        title="Crear Decoración"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitText="Crear"
      />
    </div>
  );
}