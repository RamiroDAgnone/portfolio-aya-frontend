import React from "react";
import { validateImageFile } from "../../utils/validateImageFile";

export default function ImageSingleField({
  title,
  preview,
  onChange,
  error,
  onValidationChange,
  accept = "image/*"
}) {
  const [localError, setLocalError] = React.useState(null);

  const handleChange = file => {
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
        />

        {(error || localError) && (
          <span className="error">
            {error || localError}
          </span>
        )}
      </div>
    </div>
  );
}