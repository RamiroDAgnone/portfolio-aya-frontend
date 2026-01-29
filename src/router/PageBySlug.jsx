import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../auth/constants";
import { UseAuth } from "../auth/AuthProvider";
import { authFetch } from "../auth/authFetch";

import DefaultPage from "../pages/home/Home";
import "./Slug.css";

const pageCache = {};

export default function PageBySlug({ forcedSlug, render }) {
  const params = useParams();
  const { isAuthenticated } = UseAuth();
  const slug = forcedSlug ?? params.slug;

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    if (pageCache[slug]) {
      setPage(pageCache[slug]);
      setLoading(false);
      return;
    }

    const fetchPage = async () => {
      try {
        let data;
        if (isAuthenticated) {
          data = await authFetch(`/pages/slug/${slug}`);
        } else {
          const res = await fetch(`${API_URL}/pages/slug/${slug}`);
          if (res.status === 404) throw new Error("Not Found");
          if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.error || `HTTP ${res.status}`);
          }
          data = await res.json();
        }

        if (!mounted) return;
        pageCache[slug] = data;
        setPage(data);
      } catch (err) {
        console.warn(`[PageBySlug] error fetching slug=${slug}:`, err.message);
        if (mounted) setPage(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPage();

    return () => {
      mounted = false;
    };
  }, [slug, isAuthenticated]);

  return (
    <main className="page-shell">
      {loading && <PageSkeleton />}

      {!loading && page && (
        render ? render(page) : <DefaultPage page={page} />
      )}
    </main>
  );
}

function PageSkeleton() {
  return <div className="page-skeleton" />;
}