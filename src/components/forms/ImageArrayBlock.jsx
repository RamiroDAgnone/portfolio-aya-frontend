import React from "react";
import { useImageArrayPreview } from "../../utils/previews/useImageArrayPreview";
import ImageSortableArrayList from "./ImageSortableArrayList";

const ImageArrayBlock = React.memo(function ImageArrayBlock({
  title,
  items,
  controls
}) {
  const previews = useImageArrayPreview(items);

  return (
    <ImageSortableArrayList
      title={title}
      items={items}
      previews={previews}
      {...controls}
    />
  );
});

export default ImageArrayBlock;