import { API_URL } from "../auth/constants";
import { authFetch } from "../auth/authFetch";

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

        allPagesCache[isAuthenticated] = data;
        return data;

    })().finally(() => {
        allPagesPromise[isAuthenticated] = null;
    });

    return allPagesPromise[isAuthenticated];
}