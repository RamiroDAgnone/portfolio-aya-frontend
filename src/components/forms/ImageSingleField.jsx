import React from "react";
import { validateImageFile } from "../../utils/validateImageFile";

export default function ImageSingleField({
  title,
  preview,
  onChange,
  error,
  onValidationChange,
  accept = "image/*",
  remove = false,
  onToggleRemove
}) {
  const [localError, setLocalError] = React.useState(null);

  const handleChange = file => {
    if (remove) return;
    const validationError = validateImageFile(file);

    if (validationError) {
      setLocalError(validationError);
      onValidationChange?.(true);
      return;
    }

    setLocalError(null);
    onValidationChange?.(false);
    onChange(file);
  };

  return (
    <div className="single-image-field">
      {title && <h3>{title}</h3>}

      <div className="image-field">
        {preview && (
          <img
            src={preview}
            className="single-image-preview"
            alt=""
          />
        )}

        <input
          type="file"
          accept={accept}
          onChange={e => handleChange(e.target.files[0])}
          disabled={remove}
        />

        {remove && (
          <p className="remove-warning">
            Esta imagen será eliminada al guardar.
          </p>
        )}

        {onToggleRemove && (
          <button
            type="button"
            className="remove-button"
            onClick={onToggleRemove}
          >
            {remove ? "Deshacer" : "Eliminar"}
          </button>
        )}        

        {(error || localError) && (
          <span className="error">
            {error || localError}
          </span>
        )}
      </div>
    </div>
  );
}