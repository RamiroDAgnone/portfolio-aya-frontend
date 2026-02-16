import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../../auth/authFetch";

import DecorationForm from "./DecorationForm";

export default function EditDecoration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    variation: [],
    colors: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDecoration() {
      try {
        const data = await authFetch(`/decorations/admin/${id}`);

        setFormData({
          name: data.name,
          variation: (data.variation || []).map(v => ({
            ...v,
            tempId: crypto.randomUUID()
          })),
          colors: (data.colors || []).map(c => ({
            ...c,
            tempId: crypto.randomUUID()
          }))
        });
      } catch (err) {
        console.error("Error loading decoration:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDecoration();
  }, [id]);

  async function handleSubmit(e) {
    e.preventDefault();

    const cleanVariation = formData.variation.map(({ tempId, ...v }) => v);
    const cleanColors = formData.colors.map(({ tempId, ...c }) => c);

    await authFetch(`/decorations/admin/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        variation: cleanVariation,
        colors: cleanColors
      })
    });

    navigate("/admin/decorations");
  }

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="api-conteiner">
      <DecorationForm
        title="Editar Decoración"
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        submitText="Guardar cambios"
      />
    </div>
  );
}