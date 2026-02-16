import { useEffect, useState } from "react";
import { API_URL } from "../../auth/constants";

export default function DecorationField({ value = [], onChange }) {
  const [decorationsData, setDecorationsData] = useState([]);

  useEffect(() => {
    async function fetchDecorations() {
      try {
        const res = await fetch(`${API_URL}/decorations`);
        if (!res.ok) return;

        const data = await res.json();
        if (!Array.isArray(data)) return;

        setDecorationsData(data);
      } catch (err) {
        console.error("Error loading decorations:", err);
      }
    }

    fetchDecorations();
  }, []);

  useEffect(() => {
    if (decorationsData.length === 0) return;

    const pinExists = value.some(d => d.type === "pin");
    const tapeExists = value.some(d => d.type === "tape");

    if (pinExists && tapeExists) return;

    const pinFull = decorationsData.find(d => d.name === "pin");
    const tapeFull = decorationsData.find(d => d.name === "tape");

    const newDecorations = [...value];

    if (!pinExists && pinFull) {
      newDecorations.push({
        type: "pin",
        variation: pinFull.variation?.[0]?.name || "",
        color: pinFull.colors?.[0]?.colorName || ""
      });
    }

    if (!tapeExists && tapeFull) {
      newDecorations.push({
        type: "tape",
        variation: tapeFull.variation?.[0]?.name || "",
        color: tapeFull.colors?.[0]?.colorName || ""
      });
    }

    onChange(newDecorations);
  }, [decorationsData, value, onChange]);

  function getRef(type) {
    return value.find(d => d.type === type);
  }

  function updateRef(type, field, newValue) {
    const updated = value.map(d =>
      d.type === type ? { ...d, [field]: newValue } : d
    );

    onChange(updated);
  }

  function getFull(type) {
    return decorationsData.find(d => d.name === type);
  }

  function getPreviewStyle(type) {
    const ref = getRef(type);
    const full = getFull(type);

    if (!ref || !full) return {};

    const colorObj = full.colors?.find(c => c.colorName === ref.color);

    return colorObj
      ? {
          "--color-light": colorObj.colors.light,
          "--color-dark": colorObj.colors.dark
        }
      : {};
  }

  function DecorationBlock({ type, label }) {
    const ref = getRef(type);
    const full = getFull(type);

    if (!ref || !full) return null;

    const variations = full.variation?.map(v => v.name) || [];
    const colors = full.colors?.map(c => c.colorName) || [];

    const previewClass = `scrap-${type}-${ref.variation}`;

    return (
      <div>
        <h4>{label}</h4>

        <div className="decoration-preview-name">
          <label>
            Variante
            <select
              value={ref.variation}
              onChange={e =>
                updateRef(type, "variation", e.target.value)
              }
            >
              {variations.map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </label>

          <label>
            Color
            <select
              value={ref.color}
              onChange={e =>
                updateRef(type, "color", e.target.value)
              }
            >
              {colors.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="decoration-preview-grid">
          <div className="decoration-preview-item">
            <div className="decoration-preview-box">
              <div
                className={`scrap-base ${previewClass}`}
                style={getPreviewStyle(type)}
              />
            </div>

            <div className="preview-label">
              {type} — {ref.variation} — {ref.color}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="decoration-field">
      <h3>Decoraciones</h3>

      <DecorationBlock type="pin" label="📌 Pin" />
      <DecorationBlock type="tape" label="🩹 Cinta" />
    </div>
  );
}