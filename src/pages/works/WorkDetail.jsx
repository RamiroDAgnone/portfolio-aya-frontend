import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { API_URL } from "../../auth/constants";
import { getResponsiveImageProps } from "../../utils/imageVariants";
import { UseAuth } from "../../auth/AuthProvider";
import { authFetch } from "../../auth/authFetch";

import Lightbox from "../../components/lightbox/Lightbox";

import "./WorkDetail.css";

const workDetailCache = new Map();

export default function WorkDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = UseAuth();

  const [trabajo, setTrabajo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [lightboxData, setLightboxData] = useState(null);


  useEffect(() => {
    const cacheKey = `${slug}:${isAuthenticated ? "auth" : "public"}`;

    if (workDetailCache.has(cacheKey)) {
      setTrabajo(workDetailCache.get(cacheKey));
      setLoading(false);
      return;
    }

    const request = isAuthenticated
      ? authFetch(`/works/slug/${slug}`)
      : fetch(`${API_URL}/works/slug/${slug}`).then(res => {
          if (!res.ok) throw new Error("Trabajo no encontrado");
          return res.json();
        });

    request
      .then(data => {
        workDetailCache.set(cacheKey, data);
        setTrabajo(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

  }, [slug, isAuthenticated]);


  if (loading) {
    return <div className="work-detail"><p>Cargando...</p></div>;
  }

  if (error || !trabajo) {
    return (
      <div className="work-detail not-found">
        <h2>Trabajo no encontrado</h2>
        <Link to="/" className="back-button">Home</Link>
      </div>
    );
  }

  const getYouTubeVideoId = (value) => {
      if (!value) return null;
      if (/^[\w-]{11}$/.test(value)) return value;

      try {
        const url = new URL(value);
        if (url.hostname.includes("youtube.com")) {
          return url.searchParams.get("v");
        }
        if (url.hostname.includes("youtu.be")) {
          return url.pathname.slice(1);
        }
      } catch {
        return null;
      }

      return null;
    };

    const videos = Array.isArray(trabajo.videos)
      ? trabajo.videos
          .map(v => getYouTubeVideoId(v?.url))
          .filter(Boolean)
      : [];

  return (
    <div
      className="work-detail"
      style={{ backgroundColor: trabajo.backgroundColor }}
    >
      {trabajo.status === "draft" && (
        <span className="draft-badge">BORRADOR</span>
      )}
      <div className="work-image">

        {trabajo.logo && trabajo.logo.sizes && (
          <img
            {...getResponsiveImageProps({
              image: trabajo.logo,
              sizes: "(max-width: 768px) 60vw, 30vw"
            })}
            loading="eager"
            decoding="async"
            alt={trabajo.title}
            className="work-image-logo"
          />
        )}

        {videos.length > 0 && (
          <div className="video-wrapper">
            {videos.map((videoId, index) => (
              <div className="video-item" key={index}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                  title={`${trabajo.title} video ${index + 1}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            ))}
          </div>
        )}

        {Array.isArray(trabajo.graphics) && trabajo.graphics.length > 0 && (
          <div className={`work-graphics ${trabajo.campaignType}`}>
            {trabajo.graphics.map((img, index) => (
              <img
                key={index}
                {...getResponsiveImageProps({
                  image: img,
                  sizes: "(max-width: 768px) 95vw, 1200px"
                })}
                loading="lazy"
                decoding="async"
                alt={trabajo.title}
                onClick={() =>
                  setLightboxData({
                    images: trabajo.graphics,
                    index
                  })
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="work-content">
        {Array.isArray(trabajo.extraImages) && trabajo.extraImages.length > 0 && (
          <div className="work-extra-images">
            {trabajo.extraImages.map((img, index) => (
              <img
                key={index}
                {...getResponsiveImageProps({
                  image: img,
                  sizes: "(max-width: 768px) 90vw, 280px"
                })}
                loading="lazy"
                decoding="async"
                alt={`${trabajo.title} ${index + 1}`}
                onClick={() =>
                  setLightboxData({
                    images: trabajo.extraImages,
                    index
                  })
                }
              />
            ))}
          </div>
        )}

        <div className="work-description">
          <div>
            <h1>{trabajo.title}</h1>
            {trabajo.description?.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <div className="back-button-conteiner">
            <Link to="/" className="back-button">Home</Link>
          </div>
        </div>
      </div>

      {lightboxData && (
        <Lightbox
          images={lightboxData.images}
          startIndex={lightboxData.index}
          onClose={() => setLightboxData(null)}
        />
      )}
      
    </div>
  );
}