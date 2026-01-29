import React from "react";
import SingleImageBlock from "./SingleImageBlock";
import ImageArrayBlock from "./ImageArrayBlock";
import VideoFields from "./VideoFields";

const MediaSection = React.memo(function MediaSection({
  singleImages = [],
  imageArrays = [],
  videosConfig
}) {
  return (
    <>
      {singleImages.map(img => (
        <SingleImageBlock
          key={img.key}
          title={img.title}
          file={img.file}
          current={img.current}
          error={img.error}
          onChange={img.onChange}
          onValidationChange={img.onValidationChange}
        />
      ))}

      {imageArrays.map(arr => (
        <ImageArrayBlock
          key={arr.title}
          title={arr.title}
          items={arr.items}
          controls={arr.controls}
          
        />
      ))}

      {videosConfig && <VideoFields {...videosConfig} />}
    </>
  );
});

export default MediaSection;