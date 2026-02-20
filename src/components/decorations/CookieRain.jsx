import { useState, useEffect } from "react";
import "../css/CookieRain.css";

const CookieRain = ({ trigger }) => {
    const [cookies, setCookies] = useState([]);
    const length = 15;

    useEffect(() => {
        if (trigger > 0) {
            const newBatch = Array.from({ length }).map(() => ({
                id: Math.random(),
                left: Math.random() * 95,
                size: 35 + Math.random() * 50,
                delay: Math.random() * 0.8,
                duration: 2.5 + Math.random() * 1.5
            }));

            setCookies(prev => [...prev, ...newBatch]);
            
            const batchIds = newBatch.map(c => c.id);

            const timer = setTimeout(() => {
                setCookies(prev => prev.filter(c => !batchIds.includes(c.id)));
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [trigger]);

    return (
        <div className="cookie-rain-container">
            {cookies.map(c => (
                <img
                    key={c.id}
                    src="/assets/img/cookie.png"
                    alt="cookie"
                    className="falling-cookie"
                    style={{
                        left: `${c.left}%`,
                        width: `${c.size}px`,
                        height: 'auto',
                        animationDuration: `${c.duration}s`,
                        animationDelay: `${c.delay}s`
                    }}
                    onAnimationEnd={() => {
                        setCookies(prev => prev.filter(cookie => cookie.id !== c.id));
                    }}
                />
            ))}
        </div>
    );
};

export default CookieRain;