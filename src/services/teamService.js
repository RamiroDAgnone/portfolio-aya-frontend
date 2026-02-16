import { API_URL } from "../auth/constants";

let teamCache = null;
let teamPromise = null;

export async function getTeam() {
    if (teamCache) {
        return teamCache;
    }
    
    if (teamPromise) {
        return teamPromise;
    }

    teamPromise = fetch(`${API_URL}/team`)
        .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        
        })
        .then(data => {
            teamCache = data;
            
            return data;
        })
        .finally(() => {
            teamPromise = null;
        
        });

    return teamPromise;
}