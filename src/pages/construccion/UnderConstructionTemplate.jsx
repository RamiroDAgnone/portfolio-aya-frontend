import { getResponsiveImageProps } from "../../utils/imageVariants";
import StarBackground from "../../components/decorations/StarBackground";
import "../home/Home.css"

export default function UnderConstructionTemplate({ page }) {

  return (
    <div className="home" style= {{ 
        "--bg-color": page.backgroundColor, 
        "--line-color": page.linesColor?.length === 7 ? page.linesColor + "B3" : page.linesColor
      }}
    >
      <StarBackground graphics={page.graphics} />

      {page.image && page.image.sizes && (
        <div className="home-img">
          <img
            {...getResponsiveImageProps({
              image: page.image,
              sizes: "(max-width: 768px) 90vw, 1200px"
            })}
            loading="eager"
            decoding="async"
            alt=""
          />
        </div>
      )}

      <div className="under-construction">
        {page.description?.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    </div>
  );
}