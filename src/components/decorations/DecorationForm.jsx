import ColorField from "../../components/forms/ColorField";
import "../../pages/works/api/WorkApi.css";

export default function DecorationForm({
  title,
  formData,
  setFormData,
  onSubmit,
  submitText
}) {
  
  /*
  function addVariation() {
    setFormData(prev => ({
      ...prev,
      variation: [
        ...(prev.variation || []),
        {
          tempId: crypto.randomUUID(),
          name: ""
        }
      ]
    }));
  }

  function removeVariation(index) {
    setFormData(prev => ({
      ...prev,
      variation: prev.variation.filter((_, i) => i !== index)
    }));
  }

  function updateVariation(index, value) {
    setFormData(prev => ({
      ...prev,
      variation: prev.variation.map((v, i) =>
        i === index ? { ...v, name: value } : v
      )
    }));
  }
  */

  function addColor() {
    setFormData(prev => ({
      ...prev,
      colors: [
        ...(prev.colors || []),
        {
          tempId: crypto.randomUUID(),
          colorName: "",
          colors: {
            light: "#ffffff",
            dark: "#000000"
          }
        }
      ]
    }));
  }

  function removeColor(index) {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  }

  function updateColorField(index, field, value) {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) =>
        i === index ? { ...c, [field]: value } : c
      )
    }));
  }

  function updateColorValue(index, mode, value) {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((c, i) =>
        i === index
          ? {
              ...c,
              colors: {
                ...c.colors,
                [mode]: value
              }
            }
          : c
      )
    }));
  }
  
  return (
    <div className="work-api-container">
      <form onSubmit={onSubmit} className="work-form">
        <h2>{title} {formData.name}</h2>
        {/*
        <label>Decoration Name</label>
        <input
          value={formData.name}
          onChange={e =>
            setFormData(prev => ({
              ...prev,
              name: e.target.value.trim()
            }))
          }
          placeholder="pin / tape / clip"
          required
        />

        <h3>Variations</h3>
        <div className="variation-row">
          {(formData.variation || []).map((v, i) => (
            <div key={v.tempId} className="image-row">
              <label>
                Variation Name
                <input
                  value={v.name}
                  onChange={e => updateVariation(i, e.target.value)}
                  placeholder="circle / heart / top"
                  required
                />
              </label>

              <button
                type="button"
                className="remove-button"
                onClick={() => removeVariation(i)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
        
        <button type="button" className="add-button" onClick={addVariation}>
          + Agregar Variation
        </button>
        */}

        <h3>Colores</h3>

        {(formData.colors || []).map((c, i) => {
          const previewStyle = {
            "--color-light": c.colors.light,
            "--color-dark": c.colors.dark
          };

          return (
            <div key={c.tempId} className="image-row">

              <label>
                Color Name
                <input
                  value={c.colorName}
                  onChange={e =>
                    updateColorField(i, "colorName", e.target.value)
                  }
                  placeholder="red / black / cream"
                  required
                />
              </label>

              <div className="color-row">
                <ColorField
                  label="Light"
                  value={c.colors.light}
                  onChange={e =>
                    updateColorValue(i, "light", e.target.value)
                  }
                />

                <ColorField
                  label="Dark"
                  value={c.colors.dark}
                  onChange={e =>
                    updateColorValue(i, "dark", e.target.value)
                  }
                />
              </div>

              {formData.variation?.length > 0 && formData.name && (
                <div className="decoration-preview-grid">
                  {formData.variation.map(v => {
                    const previewClass = `scrap-${formData.name}-${v.name}`;

                    return (
                      <div
                        key={v.tempId}
                        className="decoration-preview-item"
                      >
                        <div className="decoration-preview-box">
                          <div
                            className={`scrap-base ${previewClass}`}
                            style={previewStyle}
                          />
                        </div>

                        <p className="preview-label">
                          {v.name} — {c.colorName || "color"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button"
                className="remove-button"
                onClick={() => removeColor(i)}
              >
                Eliminar Color
              </button>

              <hr />
            </div>
          );
        })}

        <button type="button" className="add-button" onClick={addColor}>
          + Agregar Color
        </button>

        <button type="submit" className="form-button">
          {submitText}
        </button>
      </form>
    </div>
  );
}
