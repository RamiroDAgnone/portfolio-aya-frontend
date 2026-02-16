import { Link } from "react-router-dom";
import { getResponsiveImageProps } from "../../utils/imageVariants";

export default function Card({ slug, title, cover, onPrefetch }) {
  const hasImage = Boolean(cover && cover.sizes);

  return (
    <Link to={`/trabajos/${slug}`} className="card" 
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
    >
      <div className="card-image">
        {hasImage ? (
          <img
            {...getResponsiveImageProps({
              image: cover,
              sizes:
                "(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 400px"
            })}
            loading="lazy"
            decoding="async"
            alt={title}
          />
        ) : (
          <div className="card-placeholder">
            <span>Sin imagen</span>
          </div>
        )}
      </div>

      <div className="card-overlay">
        <h1>{title}</h1>
        <span className="detail">Ver más</span>
      </div>
    </Link>
  );
}