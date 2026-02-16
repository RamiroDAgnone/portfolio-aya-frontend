import { API_URL } from "../auth/constants";
import { authFetch } from "../auth/authFetch";

const pageCache = {};
const pagePromises = {};

let allPagesCache = {
    true: null,
    false: null
};

let allPagesPromise = {
    true: null,
    false: null
};

export async function getAllPages(isAuthenticated) {
    if (allPagesCache[isAuthenticated]) {
        return allPagesCache[isAuthenticated];
    }

    if (allPagesPromise[isAuthenticated]) {
        return allPagesPromise[isAuthenticated];
    }

    allPagesPromise[isAuthenticated] = (async () => {
        let data;

        if (isAuthenticated) {
        data = await authFetch("/pages");
        } else {
        const res = await fetch(`${API_URL}/pages`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
        }

        data.forEach(page => {
        const key = `${page.slug}_${isAuthenticated}`;
        pageCache[key] = page;
        });

        allPagesCache[isAuthenticated] = data;
        return data;
    })().finally(() => {
        allPagesPromise[isAuthenticated] = null;
    });

    return allPagesPromise[isAuthenticated];
}

export async function getPageBySlug(slug, isAuthenticated) {
    const key = `${slug}_${isAuthenticated}`;
    
    if (pageCache[key]) {
        return pageCache[key];
    }

    if (pagePromises[key]) {
        return pagePromises[key];
    }

    pagePromises[key] = (async () => {
        let data;

        if (isAuthenticated) {
            data = await authFetch(`/pages/slug/${slug}`);
        } else {
            const res = await fetch(`${API_URL}/pages/slug/${slug}`);
            
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
           
            data = await res.json();
        }

        pageCache[key] = data;

        if (!allPagesCache[isAuthenticated]) {
            setTimeout(() => {
                getAllPages(isAuthenticated).catch(() => {});
            }, 0);
        }

        return data;
    })().finally(() => {
        delete pagePromises[key];
    });

    return pagePromises[key];
}
