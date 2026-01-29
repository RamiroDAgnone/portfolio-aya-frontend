import { useEffect, useState } from "react";
import { API_URL } from "../../auth/constants";

import Card from "./Card";

import "./Works.css";

let worksCache = null;

export default function Works() {
  const [works, setWorks] = useState([]);

  useEffect(() => {
    if (worksCache) {
      setWorks(worksCache);
      return;
    }

    fetch(`${API_URL}/works`)
      .then(res => res.json())
      .then(data => {
        worksCache = data;
        setWorks(data);
      })
      .catch(err =>
        console.error("Error al cargar works:", err)
      );
  }, []);

  return (
    <div className="works">
       {Array.isArray(works) && works.length > 0 && (
          <>
            {works
              .map(work => (
                <Card
                  key={work.slug}
                  slug={work.slug}
                  title={work.title}
                  cover={work.cover}
                />
              ))}
          </>
        )}
    </div>
  );
}