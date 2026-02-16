import { API_URL } from "../auth/constants";
import { authFetch } from "../auth/authFetch";

let worksCache = null;
let worksPromise = null;

const workDetailCache = {};
const workDetailPromises = {};

export async function getWorks() {
    if (worksCache) return worksCache;
    if (worksPromise) return worksPromise;

    worksPromise = fetch(`${API_URL}/works`)
        .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        
        })
        .then(data => {
            worksCache = data;
            
            return data;
        })
        .finally(() => {
            worksPromise = null;
        });

    return worksPromise;
}

export async function getWorkBySlug(slug, isAuthenticated) {
    const key = `${slug}_${isAuthenticated}`;

    if (workDetailCache[key]) {
        return workDetailCache[key];
    }

    if (workDetailPromises[key]) {
        return workDetailPromises[key];
    }

    workDetailPromises[key] = (async () => {
        let data;

        if (isAuthenticated) {
            data = await authFetch(`/works/slug/${slug}`);
        
        } else {
            const res = await fetch(`${API_URL}/works/slug/${slug}`);
        
        if (!res.ok) throw new Error("Trabajo no encontrado");
            data = await res.json();
        }

        workDetailCache[key] = data;
        
        return data;
    
    })().finally(() => {
        delete workDetailPromises[key];
    
    });

    return workDetailPromises[key];
}