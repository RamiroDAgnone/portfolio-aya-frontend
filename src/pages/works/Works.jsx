import { useEffect, useState } from "react";
import { API_URL } from "../../auth/constants";
import { UseAuth } from "../../auth/AuthProvider";
import { getWorkBySlug } from "../../services/worksService";
import Card from "./Card";

import "./Works.css";

let worksCache = null;

export default function Works() {
  const [works, setWorks] = useState([]);
  const { isAuthenticated } = UseAuth();

  useEffect(() => {
    if (worksCache) {
      setWorks(worksCache);
      return;
    }

    fetch(`${API_URL}/works`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(data => {
        worksCache = data;
        setWorks(data);
      })
      .catch(err =>
        console.error("Error al cargar works:", err)
      );
  }, []);
  
  const handlePrefetch = (slug) => {
    getWorkBySlug(slug, isAuthenticated).catch(() => {});
  };
  
  return (
    <div className="works">
      {Array.isArray(works) &&
        works.length > 0 &&
        works.map(work => (
          <Card
            key={work.slug}
            slug={work.slug}
            title={work.title}
            cover={work.cover}
            backgroundColor={work.backgroundColor}
            onPrefetch={() => handlePrefetch(work.slug)}
          />
        ))}
    </div>
  );
}