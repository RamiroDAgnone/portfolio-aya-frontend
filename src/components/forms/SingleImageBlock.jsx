import React from "react";
import { useImageSinglePreview } from "../../utils/previews/useImageSinglePreview";
import ImageSingleField from "./ImageSingleField";

const SingleImageBlock = React.memo(function SingleImageBlock({
  title,
  file,
  current,
  remove,
  onToggleRemove,
  error,
  onChange,
  onValidationChange
}) {
  const previewRaw = useImageSinglePreview({ file, current });
  const preview = remove ? null : previewRaw;
  
  return (
    <ImageSingleField
      title={title}
      preview={preview}
      error={error}
      onChange={onChange}
      onValidationChange={onValidationChange}
      remove={remove}
      onToggleRemove={onToggleRemove}
    />
  );
});

export default SingleImageBlock;