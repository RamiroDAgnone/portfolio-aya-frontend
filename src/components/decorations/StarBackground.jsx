import { useEffect, useState } from "react";
import { getResponsiveImageProps } from "../../utils/imageVariants";
import { getAllPages } from "../../services/pagesService"
import { UseAuth } from "../../auth/AuthProvider";
import "../css/StarBackground.css";

const MAX_STARS = 200;
const MIN_DURATION = 2500; // milisegundos
const MAX_DURATION = 5500; // 2,5 - 5,5 segundos

export default function StarBackground() {
    const [stars, setStars] = useState([]);
    const [starGraphics, setStarGraphics] = useState([]);
    const { isAuthenticated } = UseAuth();

    const randomBetween = (min, max) => Math.random() * (max - min) + min;

    useEffect(() => {
        async function fetchHomeGraphics() {
            try {
                const pages = await getAllPages(isAuthenticated);
                const homePage = pages.find(p => p.slug === "home");

                if (homePage && homePage.graphics) {
                    setStarGraphics(homePage.graphics);
                }
            } catch (error) {
                console.error("Error cargando estrellas de la home:", error);
            }
        }
        fetchHomeGraphics();

    }, [isAuthenticated]);

    useEffect(() => {
        if (starGraphics.length === 0) return;

        const createStar = () => {
            const image = starGraphics[Math.floor(Math.random() * starGraphics.length)];

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
            setStars(prev => {
                if (prev.length < MAX_STARS) {
                    return [...prev, createStar()];
                }
                return prev;
            });
        }, 400);

        return () => clearInterval(interval);
        
    }, [starGraphics]);

    return (
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
                    sizes: "100px"
                })}
                alt=""
                />

            ))}
        </div>
    );
}