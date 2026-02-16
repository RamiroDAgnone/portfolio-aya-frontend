import { API_URL } from "../auth/constants";

let bProjectsCache = null;
let bProjectsPromise = null;

export async function getBProjects() {
    if (bProjectsCache) {
        return bProjectsCache;
    }

    if (bProjectsPromise) {
        return bProjectsPromise;
    }
    
    bProjectsPromise = fetch(`${API_URL}/bprojects`)
        .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
            
        })
        .then(data => {
            bProjectsCache = data;
            
            return data;
        })
        .finally(() => {
            bProjectsPromise = null;
        
        });

    return bProjectsPromise;
}