import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { UseAuth } from "../auth/AuthProvider";
import { getAllPages } from "../services/pagesService";
import { preloadSecondaryData } from "../services/preloadService";

import DefaultPage from "../pages/home/Home";
import "./Slug.css";

export default function PageBySlug({ forcedSlug, render }) {
  const params = useParams();
  const { isAuthenticated } = UseAuth();
  const slug = forcedSlug ?? params.slug;

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setPage(null);

    getAllPages(isAuthenticated)
      .then(pages => {
        if (!mounted) return;

        const found = pages.find(p => p.slug === slug) || null;
        setPage(found);

        preloadSecondaryData(isAuthenticated);
      })
      .catch(err => {
        console.warn(`[PageBySlug] error:`, err.message);
        if (mounted) setPage(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [slug, isAuthenticated]);

  return (
    <main className="page-shell">
      {loading && <PageSkeleton />}

      {!loading && page && (
        <div key={slug}>
          {render ? render(page) : <DefaultPage page={page} />}
        </div>
      )}
    </main>
  );
}

function PageSkeleton() {
  return <div className="page-skeleton" />;
}