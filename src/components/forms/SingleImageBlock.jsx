import React from "react";
import { useImageSinglePreview } from "../../utils/previews/useImageSinglePreview";
import ImageSingleField from "./ImageSingleField";

const SingleImageBlock = React.memo(function SingleImageBlock({
  title,
  file,
  current,
  error,
  onChange,
  onValidationChange
}) {
  const preview = useImageSinglePreview({ file, current });

  return (
    <ImageSingleField
      title={title}
      preview={preview}
      error={error}
      onChange={onChange}
      onValidationChange={onValidationChange}
    />
  );
});

export default SingleImageBlock;