import { useEffect, useState, useMemo } from "react";
import { getResponsiveImageProps } from "../../utils/imageVariants";

import Works from "../works/Works";

import "./Home.css";

const MAX_STARS = 200;
const MIN_DURATION = 2500; // milisegundos
const MAX_DURATION = 5500; // 2,5 - 5,5 segundos

export default function Home({ page }) {
  const [stars, setStars] = useState([]);

  const starImages = useMemo(
    () => (Array.isArray(page.graphics) ? page.graphics : []),
    [page.graphics]
  );

  const randomBetween = (min, max) =>
  Math.random() * (max - min) + min;

  useEffect(() => {
    if (!starImages.length) return;

    let mounted = true;

    const createStar = () => {
      const image =
        starImages[Math.floor(Math.random() * starImages.length)];

      return {
        id: crypto.randomUUID(),
        image,
        x: randomBetween(0, 100),
        y: randomBetween(0, 100),
        size: randomBetween(40, 80),
        duration: randomBetween(MIN_DURATION, MAX_DURATION)
      };
    };

    const interval = setInterval(() => {
      if (!mounted) return;

      setStars(prev => {
        const next = [...prev];

        if (next.length < MAX_STARS) {
          next.push(createStar());
        }

        return next;
      });
    }, 300);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [starImages]);

  return (
    <div className="home" style={{ backgroundColor: page.backgroundColor }}>
      <div className="stars">
        {stars.map(star => (
          <img
            key={star.id}
            className="star"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              animationDuration: `${star.duration}ms`
            }}
            onAnimationEnd={() =>
              setStars(prev => prev.filter(s => s.id !== star.id))
            }
            {...getResponsiveImageProps({
              image: star.image,
              context: "decoration",
              sizes: "200px"
            })}
            alt=""
          />
        ))}
      </div>

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

      <div className="works-wrapper">
        <Works />
      </div>
    </div>
  );
}